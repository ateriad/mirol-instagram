
// const Session = require("../../session");
const instagram_private_api_1 = require("instagram-private-api");
const { json } = require("body-parser");
const Bluebird = require("bluebird");

function start(req, res, next) {
    (async () => {
        if (req.body.information.session!=null) {
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
            ).catch(instagram_private_api_1.IgNetworkError, async () => {
                res.status(400).send({ 'message': '5' });
            }
            ).catch(instagram_private_api_1.IgResponseError, async () => {
                res.status(400).send({ 'message': '6' });
            }
            ).catch(e => res.status(400).send({ 'message': '10' }));
        } else {
            Bluebird.try(async () => {
                let ig = new instagram_private_api_1.IgApiClient();
                await ig.state.generateDevice(req.body.information.username);
                await ig.qe.syncLoginExperiments();
                await ig.account.login(req.body.information.username, req.body.information.password);
                
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
                const state = await ig.state.serialize();
                delete state.constants;
                res.send({ 'broadcast_id': broadcast_id, 'stream_url': stream_url, 'stream_key': stream_key ,
                'session': Buffer.from(JSON.stringify(state)).toString("base64")});

            }).catch(instagram_private_api_1.IgLoginTwoFactorRequiredError, async err => {
                res.status(400).send({ 'message': '1' });
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
        }
    })();
}

function stop(req, res, next) {
    (async () => {
        Bluebird.try(async () => {

            const ig = new instagram_private_api_1.IgApiClient();
            ig.state.generateDevice(req.body.information.username);
            let buff = Buffer.from(req.body.information.session, 'base64').toString('utf8');
            await ig.state.deserialize(buff);
            await ig.qe.syncLoginExperiments();

            const live_info = await ig.live.endBroadcast(req.body.information.broadcast_id);
            let info = await ig.live.getFinalViewerList(req.body.information.broadcast_id);
            res.send({ 'visitors_count': info.total_unique_viewer_count , 'session':req.body.information.session });

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
    (async function () {
        Bluebird.try(async () => {

            const ig = new instagram_private_api_1.IgApiClient();
            ig.state.generateDevice(req.body.username);
            let buff = Buffer.from(req.body.session, 'base64').toString('utf8');
            await ig.state.deserialize(buff);
            await ig.qe.syncLoginExperiments();
            let broadcastId = req.body.broadcast_id;
            let lastCommentTs = 0;
            let commentsRequested = 4;
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

function muteComments(req, res, next) {
    (async function () {
        Bluebird.try(async () => {

            const ig = new instagram_private_api_1.IgApiClient();
            ig.state.generateDevice(req.body.username);
            let buff = Buffer.from(req.body.session, 'base64').toString('utf8');
            await ig.state.deserialize(buff);
            await ig.qe.syncLoginExperiments();

            await ig.live.muteComment(req.body.broadcast_id);
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

function unmuteComments(req, res, next) {
    (async function () {
        Bluebird.try(async () => {

            const ig = new instagram_private_api_1.IgApiClient();
            ig.state.generateDevice(req.body.username);
            let buff = Buffer.from(req.body.session, 'base64').toString('utf8');
            await ig.state.deserialize(buff);
            await ig.qe.syncLoginExperiments();

            await ig.live.unmuteComment(req.body.broadcast_id);
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

function snedComment(req, res, next) {
    (async function () {
        Bluebird.try(async () => {

            const ig = new instagram_private_api_1.IgApiClient();
            ig.state.generateDevice(req.body.username);
            let buff = Buffer.from(req.body.session, 'base64').toString('utf8');
            await ig.state.deserialize(buff);
            await ig.qe.syncLoginExperiments();

            let comment = await ig.live.comment(req.body.broadcast_id, req.body.comment);
            res.send({ 'comment': comment.comment.pk });

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
    (async function () {
        Bluebird.try(async () => {

            const ig = new instagram_private_api_1.IgApiClient();
            ig.state.generateDevice(req.body.username);
            let buff = Buffer.from(req.body.session, 'base64').toString('utf8');
            await ig.state.deserialize(buff);
            await ig.qe.syncLoginExperiments();

            await ig.live.pinComment(req.body.broadcast_id, req.body.comment);
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

module.exports = {
    start,
    stop,
    getComments,
    muteComments,
    unmuteComments,
    pinComment,
    snedComment
};
