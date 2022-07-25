
// const Session = require("../../session");
const instagram_private_api_1 = require("instagram-private-api");
const { json } = require("body-parser");
const Bluebird = require("bluebird");

function start(req, res, next) {
    if (!req.body.information.username || req.body.information.username === "" ||
        !req.body.details.comment_status || req.body.details.comment_status === "") {
        res.status(422).send({ 'message': 9 });
        return;
    }
    (async () => {
        if (req.body.information.session != null) {
            Bluebird.try(async () => {

                let ig = new instagram_private_api_1.IgApiClient();
                await ig.state.generateDevice(req.body.information.username);
                let buff = Buffer.from(req.body.information.session, 'base64').toString('utf8');
                await ig.state.deserialize(buff);
                await ig.qe.syncLoginExperiments();
                const { broadcast_id, upload_url } = await ig.live.create({
                    previewWidth: 720,
                    previewHeight: 1280,
                    message: req.body.information.username,
                });
                const { stream_key, stream_url } = instagram_private_api_1.LiveEntity.getUrlAndKey({ broadcast_id, upload_url });
                const startInfo = await ig.live.start(broadcast_id);
                if (req.body.details.comment_status == 2) {
                    await ig.live.muteComment(broadcast_id);
                }
                res.send({ 'broadcast_id': broadcast_id, 'stream_url': stream_url, 'stream_key': stream_key });
            }).catch(instagram_private_api_1.IgLoginRequiredError, async () => {
                res.status(400).send({ 'message': '8' });
            }
            ).catch(instagram_private_api_1.IgRequestsLimitError, async () => {
                res.status(400).send({ 'message': '4' });
            }
            ).catch(instagram_private_api_1.IgActionSpamError, async () => {
                res.status(400).send({ 'message': '11' });
            }
            ).catch(instagram_private_api_1.IgNetworkError, async () => {
                res.status(400).send({ 'message': '5' });
            }
            ).catch(instagram_private_api_1.IgResponseError, async () => {
                res.status(400).send({ 'message': '6' });
            }
            ).catch(e => res.status(400).send({ 'message': '10' }));
        }else{
            res.status(422).send({ 'message': 9 });
        }
    })();
}

function stop(req, res, next) {
    if (!req.body.information.username || req.body.information.username === "" ||
        !req.body.information.session || req.body.information.session === "" ||
        !req.body.information.broadcast_id || req.body.information.broadcast_id === "") {
        res.status(422).send({ 'message': 9 });
        return;
    }
    (async () => {
        Bluebird.try(async () => {

            const ig = new instagram_private_api_1.IgApiClient();
            ig.state.generateDevice(req.body.information.username);
            let buff = Buffer.from(req.body.information.session, 'base64').toString('utf8');
            await ig.state.deserialize(buff);
            await ig.qe.syncLoginExperiments();

            const live_info = await ig.live.endBroadcast(req.body.information.broadcast_id);
            let info = await ig.live.getFinalViewerList(req.body.information.broadcast_id);
            res.send({ 'visitors_count': info.total_unique_viewer_count});

        }).catch(e => res.status(400).send({ 'message': '9' }));

    })();
}

function update(req, res, next) {
    if (!req.body.information.username || req.body.information.username === "" ||
        !req.body.information.session || req.body.information.session === "" ||
        !req.body.information.broadcast_id || req.body.information.broadcast_id === "") {
        res.status(422).send({ 'message': 9 });
        return;
    }
    (async function () {
        Bluebird.try(async () => {

            const ig = new instagram_private_api_1.IgApiClient();
            ig.state.generateDevice(req.body.information.username);
            let buff = Buffer.from(req.body.information.session, 'base64').toString('utf8');
            await ig.state.deserialize(buff);
            await ig.qe.syncLoginExperiments();

            if (req.body.details.comment_status == 1)
                await ig.live.unmuteComment(req.body.information.broadcast_id);
            else if (req.body.details.comment_status == 2)
                await ig.live.muteComment(req.body.information.broadcast_id);

            res.send({ 'status': 'ok' });
        }).catch(instagram_private_api_1.IgLoginRequiredError, async () => {
            res.status(400).send({ 'message': '8' });
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
        ).catch(e => res.status(400).send({ 'message': '10' }));

    })();
}

function getComments(req, res, next) {
    if (!req.body.destination.information.username || req.body.destination.information.username === "" ||

    !req.body.destination.information.session || req.body.destination.information.session === "" ||
        !req.body.destination.information.broadcast_id || req.body.destination.information.broadcast_id === "") {
        res.status(422).send({ 'message': 9 });
        return;
    }
    (async function () {
        Bluebird.try(async () => {

            const ig = new instagram_private_api_1.IgApiClient();
            ig.state.generateDevice(req.body.destination.information.username);
            let buff = Buffer.from(req.body.destination.information.session, 'base64').toString('utf8');
            await ig.state.deserialize(buff);
            await ig.qe.syncLoginExperiments();
            let broadcastId = req.body.destination.information.broadcast_id;
            let lastCommentTs = (req.body.comment.comment ? req.body.comment.comment.created_at:0);
            let commentsRequested = 10;
            let { comments } = await ig.live.getComment({ broadcastId, commentsRequested, lastCommentTs });
            res.send({ 'comments': comments });

        }).catch(instagram_private_api_1.IgLoginRequiredError, async () => {
            res.status(400).send({ 'message': '8' });
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
        ).catch(e => res.status(400).send({ 'message': '10' }));

    })();
}

function sendComment(req, res, next) {
    if (!req.body.destination.information.username || req.body.destination.information.username === "" ||

    !req.body.destination.information.session || req.body.destination.information.session === "" ||
        !req.body.destination.information.broadcast_id || req.body.destination.information.broadcast_id === "") {
        res.status(422).send({ 'message': 9 });
        return;
    }
    (async function () {
        Bluebird.try(async () => {

            const ig = new instagram_private_api_1.IgApiClient();
            ig.state.generateDevice(req.body.destination.information.username);
            let buff = Buffer.from(req.body.destination.information.session, 'base64').toString('utf8');
            await ig.state.deserialize(buff);
            await ig.qe.syncLoginExperiments();

            let comment = await ig.live.comment(req.body.destination.information.broadcast_id, req.body.comment);
            res.send({ 'comment': comment });

        }).catch(instagram_private_api_1.IgLoginRequiredError, async () => {
            res.status(400).send({ 'message': '8' });
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
        ).catch(e => res.status(400).send({ 'message': '10' }));

    })();
}

function pinComment(req, res, next) {
    if (!req.body.destination.information.username || req.body.destination.information.username === "" ||

    !req.body.destination.information.session || req.body.destination.information.session === "" ||
        !req.body.destination.information.broadcast_id || req.body.destination.information.broadcast_id === "" ||
        !req.body.comment || req.body.comment === "") {
        res.status(422).send({ 'message': 9 });
        return;
    }
    
    (async function () {
        Bluebird.try(async () => {

            const ig = new instagram_private_api_1.IgApiClient();
            ig.state.generateDevice(req.body.destination.information.username);
            let buff = Buffer.from(req.body.destination.information.session, 'base64').toString('utf8');
            await ig.state.deserialize(buff);
            await ig.qe.syncLoginExperiments();

            await ig.live.pinComment(req.body.destination.information.broadcast_id, req.body.comment.comment.pk);
            res.send({ 'status': "ok" });

        }).catch(instagram_private_api_1.IgLoginRequiredError, async () => {
            res.status(400).send({ 'message': '8' });
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
        ).catch(e => res.status(400).send({ 'message': '10' }));

    })();
}

function unpinComment(req, res, next) {
    if (!req.body.destination.information.username || req.body.destination.information.username === "" ||

    !req.body.destination.information.session || req.body.destination.information.session === "" ||
        !req.body.destination.information.broadcast_id || req.body.destination.information.broadcast_id === "" ||
        !req.body.comment || req.body.comment === "") {
        res.status(422).send({ 'message': 9 });
        return;
    }

    (async function () {
        Bluebird.try(async () => {

            const ig = new instagram_private_api_1.IgApiClient();
            ig.state.generateDevice(req.body.destination.information.username);
            let buff = Buffer.from(req.body.destination.information.session, 'base64').toString('utf8');
            await ig.state.deserialize(buff);
            await ig.qe.syncLoginExperiments();

            await ig.live.unpinComment(req.body.destination.information.broadcast_id, req.body.comment.comment.pk);
            res.send({ 'status': "ok" });

        }).catch(instagram_private_api_1.IgLoginRequiredError, async () => {
            res.status(400).send({ 'message': '8' });
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
        ).catch(e => res.status(400).send({ 'message': '10' }));

    })();
}

function getViewers(req, res, next) {
    if (!req.body.destination.information.username || req.body.destination.information.username === "" ||

    !req.body.destination.information.session || req.body.destination.information.session === "" ||
        !req.body.destination.information.broadcast_id || req.body.destination.information.broadcast_id === "") {
        res.status(422).send({ 'message': 9 });
        return;
    }

    (async function () {
        Bluebird.try(async () => {

            const ig = new instagram_private_api_1.IgApiClient();
            ig.state.generateDevice(req.body.destination.information.username);
            let buff = Buffer.from(req.body.destination.information.session, 'base64').toString('utf8');
            await ig.state.deserialize(buff);
            await ig.qe.syncLoginExperiments();

            let {users} = await ig.live.getViewerList(req.body.destination.information.broadcast_id);
            res.send({ 'viewers': users });

        }).catch(instagram_private_api_1.IgLoginRequiredError, async () => {
            res.status(400).send({ 'message': '8' });
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
        ).catch(e => res.status(400).send({ 'message': '10' }));

    })();
}

module.exports = {
    start,
    stop,
    update,
    getComments,
    pinComment,
    unpinComment,
    sendComment ,
    getViewers
};
