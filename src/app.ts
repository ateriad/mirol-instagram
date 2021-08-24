import express from 'express';
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()

import { IgApiClient, LiveEntity } from 'instagram-private-api';
const app = express();
const port = 3000;
app.post('/api/v2/login',jsonParser,async (req, res) => {
   try{
     const ig = new IgApiClient();
    ig.state.generateDevice(req.body.username);
    const auth=await ig.account.login(req.body.username,req.body.password);  
    res.send({'error':false ,'status':'0'});
    }catch(e){
	res.send({'error': true ,'message':e.message});
    }
});
app.post('/api/v2/live/start', jsonParser ,async (req, res) => {	

	try{
	const ig = new IgApiClient()
	ig.state.generateDevice(req.body.username);
        const auth=await ig.account.login(req.body.username,req.body.password);
	try{
	const { broadcast_id, upload_url } = await ig.live.create({
   	previewWidth: 720,
    	previewHeight: 1280,
   	 message: req.body.username,
	  });
 	const { stream_key, stream_url } = LiveEntity.getUrlAndKey({ broadcast_id, upload_url });
  
        const startInfo =await ig.live.start(broadcast_id);
	if(req.body.hascomment==0){
		await ig.live.muteComment(broadcast_id);
	}else{
	 if(req.body.comment!=null){
                   await ig.live.comment(broadcast_id, req.body.comment);
               }
	}
	res.send({'error':'false','status':'0','broadcast_id':broadcast_id,'base_url':stream_url,'stream_key':stream_key});
	}catch(e){
	 res.send({'error':'true','status':'1','message':e.message});
	}	
	}catch(e){
	     res.send({'error':'true','status':'0','message':e.message});
	}
});
app.post('/api/v2/live/stop', jsonParser ,async (req, res) => {
        try{
        const ig = new IgApiClient()
        ig.state.generateDevice(req.body.username);
        const auth=await ig.account.login(req.body.username,req.body.password);
        try{
	const live_info =await ig.live.endBroadcast(req.body.broadcast_id);
	let info=await ig.live.getFinalViewerList(req.body.broadcast_id);

	  res.send({'error':'false','status':'0','count':info.total_unique_viewer_count ,'message':live_info});
	}catch(e){
	res.send({'error':'false','status':'0','message':e.message});
	}
	}catch(e){
	res.send({'error':'true','status':'0','message':e.message});
	}
});

app.post('/api/v2/live/mutecomment', jsonParser ,async (req, res) => {
	try{
	const ig = new IgApiClient()
	ig.state.generateDevice(req.body.username);
	const auth=await ig.account.login(req.body.username,req.body.password);
	try{
		if(req.body.hascomment==0){
			await ig.live.muteComment(req.body.broadcast_id);
		}else{
			await ig.live.unmuteComment(req.body.broadcast_id);
		}
  res.send({'error':'false','status':'0'});
}catch(e){
res.send({'error':'false','status':'0','message':e.message});
}
}catch(e){
res.send({'error':'true','status':'0','message':e.message});
}
});

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
