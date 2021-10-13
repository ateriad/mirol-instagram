
//const Session = require("../../session");
const instagram_private_api_1 = require("instagram-private-api");
const Bluebird = require("bluebird");

function login(req, res, next) {
    (async () => {
        const ig = new instagram_private_api_1.IgApiClient();

        Bluebird.try(async () => {

            ig.state.generateDevice(req.body.username);
            await ig.qe.syncLoginExperiments();
            await ig.account.login(req.body.username, req.body.password);
            const state = await ig.state.serialize();
            delete state.constants;
            res.send({ 'session': Buffer.from(JSON.stringify(state)).toString("base64"),'2fa_required': false });

        }).catch(instagram_private_api_1.IgLoginTwoFactorRequiredError, async err => {
            const state = await ig.state.serialize();
            delete state.constants;
            const { username, totp_two_factor_on, two_factor_identifier } = err.response.body.two_factor_info;
            const verificationMethod = totp_two_factor_on ? '0' : '1';

            res.status(200).send({
                '2fa_required': true, 'session': Buffer.from(JSON.stringify(state)).toString("base64"),
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
        ).catch(e => res.status(400).send({ 'message': '10' }));

    })();
};

function confirmChallenge(req, res, next) {

}

function confirmTf(req, res, next) {
    (async () => {

        Bluebird.try(async () => {

            const ig = new instagram_private_api_1.IgApiClient();
            let username = req.body.username;
            ig.state.generateDevice(req.body.username);
            let buff = Buffer.from(req.body.session, 'base64').toString('utf8');
            await ig.state.deserialize(buff);
            await ig.qe.syncLoginExperiments();
            await ig.account.twoFactorLogin({
                username,
                verificationCode: req.body.code,
                twoFactorIdentifier: req.body.two_factor_identifier,
                verificationMethod: req.body.verificationMethod,
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

module.exports = {
    login,
    confirmChallenge,
    confirmTf
};
