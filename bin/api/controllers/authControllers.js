
//const Session = require("../../session");
const instagram_private_api_1 = require("instagram-private-api");
const Bluebird = require("bluebird");
const fs = require("fs");
const path = require("path");

function login(req, res, next) {
    if (!req.body.information.username || req.body.information.username === "" ||
        !req.body.information.password || req.body.information.password === "") {
        res.status(422).send({ 'message': 9 });
        return;
    }
    (async () => {
        const ig = new instagram_private_api_1.IgApiClient();

        Bluebird.try(async () => {

            const {username,password} = req.body.information;

            ig.state.generateDevice(username);
    
            await ig.account.login(username,password);

            await ig.state.serialize();
            await ig.qe.syncLoginExperiments();
            const state = await ig.state.serialize();
            delete state.constants;

             // Log the serialized state for debugging
            // console.log('Serialized state:', JSON.stringify(state, null, 2));

            const filePath = path.resolve(path.dirname(__dirname),'../../session.json');

            fs.writeFile(filePath,JSON.stringify(state),(err)=> {
                if(err){
                    console.log(`Write file error : ${err.message}`);
                }
                console.log("File written successfully.");
            })

            res.send({
                'session': Buffer.from(JSON.stringify(state)).toString("base64")
            });

        }).catch(instagram_private_api_1.IgLoginTwoFactorRequiredError, async err => {
            const state = await ig.state.serialize();
            delete state.constants;
            const { username, totp_two_factor_on, two_factor_identifier } = err.response.body.two_factor_info;
            const verificationMethod = totp_two_factor_on ? '0' : '1';

            res.status(200).send({
                'session': Buffer.from(JSON.stringify(state)).toString("base64"),
                'two_factor_identifier': two_factor_identifier, 'verificationMethod': verificationMethod
            });
        }).catch(instagram_private_api_1.IgLoginBadPasswordError, async () => {
            res.status(400).send({ 'message': '2' });
        }
        ).catch(instagram_private_api_1.IgLoginInvalidUserError, async () => {
            res.status(400).send({ 'message': '3' });
        }
        ).catch(instagram_private_api_1.IgRequestsLimitError, async () => {
            res.status(400).send({ 'message': '4' });
        }
        ).catch(instagram_private_api_1.IgNetworkError, async () => {
            res.status(400).send({ 'message': '5' });
        }
        ).catch(instagram_private_api_1.IgResponseError, async () => {
            res.status(400).send({ 'message': '6' });
        }
        ).catch(instagram_private_api_1.IgCheckpointError, async () => {
            res.status(400).send({ 'message': '7 ' });
        }
        ).catch(e => res.status(400).send({ 
            'message': '10',
            'details' : e.message,
            'stack' : e.stack,
            'name'  : e.name
         }));

    })();
};

function confirmChallenge(req, res, next) {
    /**
     * confirm instagram chllenge
     */
}

function confirmTf(req, res, next) {

    if (!req.body.destination.information.username || req.body.destination.information.username === "" ||
        !req.body.destination.information.two_factor_identifier || req.body.destination.information.two_factor_identifier === "" ||
        !req.body.destination.information.verificationMethod || req.body.destination.information.verificationMethod === "" ||
        !req.body.code || req.body.code === "") {
        res.status(422).send({ 'message': 9 });
        return;
    }

    (async () => {

        Bluebird.try(async () => {

            const ig = new instagram_private_api_1.IgApiClient();
            let username = req.body.destination.information.username;
            ig.state.generateDevice(username);
            let buff = Buffer.from(req.body.destination.information.session, 'base64').toString('utf8');
            await ig.state.deserialize(buff);
            await ig.qe.syncLoginExperiments();
            await ig.account.twoFactorLogin({
                username,
                verificationCode: req.body.code,
                twoFactorIdentifier: req.body.destination.information.two_factor_identifier,
                verificationMethod: req.body.destination.information.verificationMethod,
                trustThisDevice: '1',
            });
            await ig.qe.syncLoginExperiments();
            const state = await ig.state.serialize();
            delete state.constants;
            res.send({ 'session': Buffer.from(JSON.stringify(state)).toString("base64") });

        }).catch(instagram_private_api_1.IgLoginTwoFactorRequiredError, async () => {
            res.status(400).send({ 'message': '1' })
        }).catch(instagram_private_api_1.IgLoginBadPasswordError, async () => {
            res.status(400).send({ 'message': '2' })
        }
        ).catch(instagram_private_api_1.IgLoginInvalidUserError, async () => {
            res.status(400).send({ 'message': '3' });
        }
        ).catch(instagram_private_api_1.IgRequestsLimitError, async () => {
            res.status(400).send({ 'message': '4' });
        }
        ).catch(instagram_private_api_1.IgNetworkError, async () => {
            res.status(400).send({ 'message': '5' });
        }
        ).catch(instagram_private_api_1.IgResponseError, async () => {
            res.status(400).send({ 'message': '6' });
        }
        ).catch(instagram_private_api_1.IgCheckpointError, async () => {
            res.status(400).send({ 'message': '7' });
        }
        ).catch(e => res.status(400).send({ 'message': '10' }));

    })();
}

function logout(req, res, next) {
    (async () => {
        try {
            let ig = new instagram_private_api_1.IgApiClient();
            await ig.state.generateDevice(req.body.information.username);
            let buff = Buffer.from(req.body.information.session, 'base64').toString('utf8');
            await ig.state.deserialize(buff);
            await ig.qe.syncLoginExperiments();

            await ig.account.logout();
            res.status(204).send();
        } catch (e) {
            res.status(400).send({ 'message': '10' });
        }
    })();
}

module.exports = {
    login,
    logout,
    confirmChallenge,
    confirmTf
};
