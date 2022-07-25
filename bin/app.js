"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const instagram_private_api_1 = require("instagram-private-api");
const app = express_1.default();
const port = 3000;
const apiRoute = require('./api/routes/api');
const session = require('./session'); 
app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', true);
    req.method === 'OPTIONS' ? res.sendStatus(200) : next();
});
//let context = new session();
app.use('/api/v2',jsonParser, apiRoute());

app.get('/health-check', (req, res, next) => {
    res.json({ message: 'ok' });
  });
  
// app.post('/api/v2/live/start', jsonParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
//     try {
//         const ig = new instagram_private_api_1.IgApiClient();
//         ig.state.generateDevice(req.body.username);
//         const auth = yield ig.account.login(req.body.username, req.body.password);
//         try {
//             const { broadcast_id, upload_url } = yield ig.live.create({
//                 previewWidth: 720,
//                 previewHeight: 1280,
//                 message: req.body.username,
//             });
//             const { stream_key, stream_url } = instagram_private_api_1.LiveEntity.getUrlAndKey({ broadcast_id, upload_url });
//             const startInfo = yield ig.live.start(broadcast_id);
//             if (req.body.hascomment == 0) {
//                 yield ig.live.muteComment(broadcast_id);
//             }
//             else {
//                 if (req.body.comment != null) {
//                     yield ig.live.comment(broadcast_id, req.body.comment);
//                 }
//             }
//             res.send({ 'broadcast_id': broadcast_id, 'stream_url': stream_url, 'stream_key': stream_key });
//         }
//         catch (e) {
//             res.status(500).send({ 'message': e.message });
//         }
//     }
//     catch (e) {
//         res.status(400).send({ 'message': e.message });
//     }
// }));

// app.post('/api/v2/live/stop', jsonParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
//     try {
//         const ig = new instagram_private_api_1.IgApiClient();
//         ig.state.generateDevice(req.body.username);
//         const auth = yield ig.account.login(req.body.username, req.body.password);
//         try {
//             const live_info = yield ig.live.endBroadcast(req.body.broadcast_id);
//             let info = yield ig.live.getFinalViewerList(req.body.broadcast_id);
//             res.send({ 'count': info.total_unique_viewer_count, 'message': live_info });
//         }
//         catch (e) {
//             res.status(500).send({ 'message': e.message });
//         }
//     }
//     catch (e) {
//         res.status(400).send({ 'message': e.message });
//     }
// }));

// app.post('/api/v2/live/mutecomment', jsonParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
//     try {
//         const ig = new instagram_private_api_1.IgApiClient();
//         ig.state.generateDevice(req.body.username);
//         const auth = yield ig.account.login(req.body.username, req.body.password);
//         try {
//             if (req.body.hascomment == 0) {
//                 yield ig.live.muteComment(req.body.broadcast_id);
//             }
//             else {
//                 yield ig.live.unmuteComment(req.body.broadcast_id);
//             }
//             res.send({ 'status': 'ok' });
//         }
//         catch (e) {
//             res.status(500).send({ 'message': e.message });
//         }
//     }
//     catch (e) {
//         res.status(400).send({ 'message': e.message });
//     }
// }));

app.listen(port, () => {
    return console.log(`server is listening on ${port}`);
});

