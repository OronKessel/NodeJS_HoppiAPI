import {Config} from '../doc/config'

export function sendEmail(info)
{
    let formdata = new FormData();
    // formdata.append("media[owner]", owner);
    // formdata.append("media[group]", group);
    return new Promise(function(resolve, reject) {        
        fetch(Config.SendGridAPIBase, {
        method: 'POST',
        headers: {
            'authorization': "Bearer " + Config.SendGridAPIKey,
            'content-type':"application/json"
        },
        body: formdata
        })
        .then((response) => {
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });   
}