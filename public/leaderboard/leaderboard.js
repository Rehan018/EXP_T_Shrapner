window.addEventListener('DOMContentLoaded', fetchuserExpenses)

const expenseDiv = document.getElementById('expense-div');

async function fetchuserExpenses(e){
   e.preventDefault()

   let token = localStorage.getItem('token');  //getting the token
   let loadUserId = +localStorage.getItem('clickedUser')  //convert to number
//    
    try {
        console.log(loadUserId , token) 

        
        let response = await axios.get(`http://localhost:5000/expense/getInfo/${loadUserId}`  ,  {headers : {'Authorization': token}} )

        
        console.log(response)
        if(response.data.success){
            response.data.data.map(data=>{   //using array map to tracsform each element into a new array
                showOnScreen(data);
            })
        }
        
    } catch (error) {
        console.log(error)
    }
}

function showOnScreen(data){
    let child = `<li class="list" >
    <span class="expense-info"> ₹ ${data.eamount} - ${data.category} - ${data.edescription}</span>
</li>`

expenseDiv.innerHTML += child
}