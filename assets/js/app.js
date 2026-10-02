var cl=console.log;

const Tododata=document.getElementById("Tododata");
const form=document.getElementById("form");
const item=document.getElementById("item");
const AddBtn=document.getElementById("AddBtn");
const UpdateBtn=document.getElementById("UpdateBtn");
const spinner=document.getElementById("spinner");

const BASE_URL="https://xhrcrud-default-rtdb.firebaseio.com";
const My_URL =`${BASE_URL}/mytodo.json`

MytodoArr=[];
function OnToggle(){
    spinner.classList.toggle("d-none")
}


function Spinnerhandler(){

spinner.classList.toggle("d-none")
}


function Templating(arr){
    let result=``;
    arr.forEach(ele=> {
        result+=` <li class="list-group-item d-flex justify-content-between align-items-center mb-4" id="${ele.id}">
                                <span>${ele.item}</span>
                                <div>
                                    <button onclick="OnEdit(this)" class="btn btn-sm btn-primary">Edit</button>
                                     <button onclick="OnRemove(this)" class="btn btn-sm btn-danger">Delete</button>
                                    </div>
                                
                            </li>

        `
        
    });
    Tododata.innerHTML=result;
}



function Onread(eve){
    let xhr= new XMLHttpRequest();
    xhr.open("GET",`${BASE_URL}/mytodo.json`)
    xhr.send(null);
    xhr.onload=function(){
        if(xhr.status >=200 && xhr.status <= 299){
            let res= JSON.parse(xhr.response);
            MytodoArr=[];
            for(const key in res){
                res[key].id=key
                MytodoArr.push(res[key]);
            }
            Templating(MytodoArr);
        }else{
            cl("error")
        }
    }
}
Onread();



//create
function Oncreate(eve){
    eve.preventDefault();
    let obj={
        item:item.value.trim()

    }
    let xhr= new XMLHttpRequest();
    xhr.open("POST",`${BASE_URL}/mytodo.json`);
        Spinnerhandler();

    xhr.send(JSON.stringify(obj));
    xhr.onload=function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res= JSON.parse(xhr.response);
            let li=document.createElement("li");
            li.id=res.name;
            li.className="list-group-item d-flex justify-content-between align-items-center mb-4"
            li.innerHTML=`<span>${obj.item}</span>
                                <div>
                                    <button onclick="OnEdit(this)" class="btn btn-sm btn-primary">Edit</button>
                                     <button onclick="OnRemove(this)" class="btn btn-sm btn-danger">Delete</button>
                                    </div> `
                                    Tododata.append(li);
                                form.reset();
                            Swal.fire({
                        title: "Created!",
                        text: "Your file has been Created succsesfully.",
                        icon: "success"
                    });
        


        }else{
            cl("error")
        }
                Spinnerhandler();

    }

    }





    


function OnEdit(eve){
    let Edit_Id=eve.closest("li").id;
    localStorage.setItem("Edit_Id",Edit_Id);
    let xhr= new XMLHttpRequest();
    xhr.open("GET",`${BASE_URL}/mytodo/${Edit_Id}.json`)
    xhr.send(null);
    xhr.onload=function(){
        if(xhr.status >= 200 && xhr.status<= 299){
            let res=JSON.parse(xhr.response);
            item.value=res.item;
            AddBtn.classList.add("d-none");
            UpdateBtn.classList.remove("d-none");
        }
    }
}

function OnUpBtnhandler(eve){
    let Update_id=localStorage.getItem("Edit_Id");
    let Upobj={
        id:Update_id,
        item:item.value
    }
    let xhr= new XMLHttpRequest();
    xhr.open("PATCH",`${BASE_URL}/mytodo/${Update_id}.json`)
    Spinnerhandler();
    xhr.send(JSON.stringify(Upobj));
    xhr.onload=function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res= JSON.parse(xhr.response);
            let li= document.getElementById(Update_id)
            li.querySelector("span").innerHTML=item.value;
            AddBtn.classList.remove("d-none");
            UpdateBtn.classList.add("d-none");
            form.reset();
        
            
        }else{
            cl("error");
        }
        Spinnerhandler();
    }
}





function OnRemove(eve){
        let Remove_id= eve.closest("li").id;
        let confirmation=confirm("Are you sure to delete??")
        if(confirmation){
            let xhr= new XMLHttpRequest();
            xhr.open("DELETE",`${BASE_URL}/mytodo/${Remove_id}.json`)
            Spinnerhandler();
            xhr.send(null);
            xhr.onload=function(){
                if(xhr.status >= 200 && xhr.status <=299){
                    eve.closest("li").remove();
                 Swal.fire({
                        title: "Deleted!",
                        text: `Your Remove  id:${Remove_id} deleted!`,
                        icon: "success"
                    });
        

                    
                }else{
                    cl("error")
                }
                Spinnerhandler();
                 }
        }

    }

form.addEventListener("submit",Oncreate);
UpdateBtn.addEventListener("click",OnUpBtnhandler);