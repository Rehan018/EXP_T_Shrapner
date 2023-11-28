

const token = localStorage.getItem('token');

const listurl = document.getElementById('listurl-div');

const download  = document.getElementById('download');

let listno = 0;

window.addEventListener('DOMContentLoaded', async(event)=>{
    event.preventDefault();
    


    try{

        
        let response = await axios.get('http://localhost:5000/expense/getAllUrl', {headers:{'Authorization': token}})


        if(response.status === 200){
            //some code
            //console.log(reponse);
            console.log(response);

            showUrls(response.data);

        }
        console.log('into reportsssssssssss');


    }
    catch(error){
        console.log(error);
        
    }

})


function showUrls(data){
    listurl.innerHTML = ''

    data.urls.forEach(url => {

        let child = `<li class="list" >
        <a href= "${url.fileURL}" class="expense-info"> ${listno + 1}. ${url.filename.split('/')[1]}</a>
        </li>`

        listurl.innerHTML += child

        listno++
        
    });
}



download.addEventListener('click', async(event)=>{

    event.preventDefault();

    try{

       /* let reponse = await axios.get('http://localhost:5000/expense/download', {headers:{'Authorization': token}})

        if(response.status == 200){
            //some code
            console.log(response);
        }

*/

        let response =  await axios.get('http://localhost:5000/expense/download', { headers: {"Authorization" : token} })

        
        if(response.status === 200){
            //the bcakend is essentially sending a download link
            //  which if we open in browser, the file would download
            console.log(response.data.downloadUrlData);
            showUrlOnScreen(response.data.downloadUrlData)
            var a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message)
        }

    }
    catch(error){
        console.log(error);
    }
    
})


function showUrlOnScreen(data){
   // console.log(data);
   // console.log(data.fileURL);
    //console.log(data.fileURL)
    let  child = `<li class="list" >
        <a href="${data.fileURL}" class="expense-info">${listno + 1} ${data.filename.split('/')[1]}</a>
    </li>`  

listurl.innerHTML += child


}


