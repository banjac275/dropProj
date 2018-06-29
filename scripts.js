class Dropdown {
    constructor(userPreferences, data, c){
        let div = document.createElement("div");
        div.id = `drop-main${c}`;
        div.classList.add("drop-main");
        div.innerHTML = `<div id="drop-input${c}" class="drop-input">
                            <div id="inserted-parent${c}" class="inserted-parent"></div>
                            <div id="sepElems${c}" class="sepElems">
                                <input type="text" id="input-text${c}" class="input-text" autocomplete="off" placeholder="  Search...">
                                <div id="drop${c}" class="drop">
                                    <div id="dropdown${c}" class="dropdown">
                                    </div>
                                </div>
                            </div>
                            <div id="inserted-parent-after${c}" class="inserted-parent-after"></div>
                        </div>`;   
        div.style.minWidth = userPreferences.width;
        div.style.minHeight = userPreferences.height;
        document.body.appendChild(div);
        this.input = document.getElementById(`input-text${c}`);
        this.drop = document.getElementById(`dropdown${c}`);
        this.dropParent = document.getElementById(`drop${c}`);
        this.dropMenu = null;
        document.getElementById(`inserted-parent${c}`).style.maxHeight = userPreferences.height;
        this.input.style.minWidth = userPreferences.width;
        this.input.style.height = userPreferences.height;        
        this.drop.style.width = userPreferences.width;
        this.drop.style.minHeight = userPreferences.height;
        this.drop.style.height = userPreferences.height * data.length;
        this.height = userPreferences.height;
        this.width = userPreferences.width;
        this.listedElStyle = userPreferences.listedElStyle;
        this.data = data;
        this.lastEntry = "";
        this.selElement = [];
        this.c = c;        
        this.dropParent.style.display = "none";
    }
    
    addDropdown(info, num){
        this.drop.innerHTML = "";
        let temp1 = [];
        let temp2 = [];
        if(num !== 0){
            this.data.forEach(element => {
                let stringValue = element;
                let stringValueCopy = stringValue;
                let match;

                //desava se da se zakove ako trazi u prazno pa zato ovo
                if(info !== ""){
                    match = new RegExp(info, "i").exec(stringValueCopy)
                    stringValueCopy = stringValueCopy.replace(match, "");
                    stringValue = stringValue.replace(match, `<span>temporary</span>`);
                    
                    stringValue = stringValue.replace(/temporary/ig, info);
                    let pos = String(element).search(new RegExp(info, "i"));
                    if(pos != -1){ temp1.push(stringValue); temp2.push(element); }
                }
            }); 
        } else {
            let tempNum;
            (this.data.length > 4) ? tempNum = 4 : tempNum = this.data.length; 
            for(let i = 0; i < tempNum; i++) temp2.push(this.data[i]);
        }

        let tempLen;
        (num !== 0) ? tempLen = temp1.length : tempLen = temp2.length;

        if(temp2.length !== 0){
            let temp;
            (num !== 0) ? temp = temp1 : temp = temp2;

            temp.forEach((el, ind) => {
                this.drop.innerHTML += `<div tabindex="${this.c}" id="pos${ind}${this.c}" class="dropmenu${this.c}">${el}</div>`;                    
            });
        }

        this.drop.style.height = this.height * temp2.length;
        this.dropMenu = document.querySelectorAll(`.dropmenu${this.c}`);

        if(temp2.length != 0){
            this.initDropdownListeners(temp2, this.dropMenu);
        } else {
            this.dropParent.style.display = "none";
        }
    }

    emptyStr(){
        this.drop.innerHTML = "";
        this.addDropdown("", 0);
    }

    initSearch(){
        this.emptyStr();

        this.input.addEventListener("keyup", (e) => {
            if(this.input.value === "" && this.drop.childElementCount == 0) this.dropParent.style.display = "none";
            else this.dropParent.style.display = "block";

            if(this.lastEntry !== this.input.value){
                this.addDropdown(this.input.value, 1);
                this.lastEntry = this.input.value;
            }
            if(this.input.value === ""){
                this.dropParent.style.display = "none";
                this.emptyStr();
            }
            if(e.key == "ArrowDown"){
                this.dropParent.style.display = "block";
                if(this.dropMenu.length !== 0) document.getElementById(`pos0${this.c}`).focus();
            }

            if(e.key === "Enter" && this.input.value !== "" && this.input.value.length > 1){
                let temp = [];
                this.data.forEach(element => {
                    let pos = String(element).search(new RegExp(this.input.value, "i"));
                    if(pos != -1) temp.push(element);
                }); 
                if(temp.length !== 0) {
                    this.isSelected(temp[0]);
                    this.input.focus();                    
                }
            }
        });

        this.drop.addEventListener("keyup", (y) => {
            if(y.key == "ArrowDown"){
                this.dropMenu.forEach((el,ind) => {
                    if(y.path[0] === el && ind < this.dropMenu.length-1){
                            this.dropMenu[ind+1].focus();
                        }
                });
            }
            if(y.key == "ArrowUp"){
                this.dropMenu.forEach((el,ind) => {
                    if(y.path[0] === el){
                        if(ind > 0) this.dropMenu[ind-1].focus();
                        if(ind === 0) this.input.focus();
                    }
                });        
                    
            }
        });

        this.input.addEventListener("click", (e) => {
            e.stopPropagation();
            if(this.input.value === "" && this.drop.childElementCount == 0) this.dropParent.style.display = "none";
            else this.dropParent.style.display = "block";               
            
        });

        document.addEventListener("click", (ev) => {
            if(this.input.value === "")  this.dropParent.style.display = "none";
            //else this.dropParent.style.display = "block";

        }); 

    }

    initDropdownListeners(arr, loc){
        for(let i = 0; i < arr.length; i++){
            loc[i].addEventListener("click", () =>{
                this.isSelected(arr[i]);             
            });
            loc[i].addEventListener("focus", (k) =>{
                    k.path[0].addEventListener("keyup", (line) => {
                        if(line.key == "Enter"){
                        this.isSelected(arr[i]);                       
                    }
                });                    
            });
        } 
           
    }

    isSelected(arr){
        this.selElement.push(arr);
        let insParent = document.getElementById(`inserted-parent${this.c}`)
        let insParentAfter = document.getElementById(`inserted-parent-after${this.c}`);
        let newNode = document.createElement("div");
        newNode.innerHTML = ` ${arr} <span class="inserted-btn"> x </span>`;

        switch(this.listedElStyle){
            case "bubble":{
                newNode.classList.add("inserted");
                newNode.classList.add(`inserted-sel${this.c}`);    
                insParent.appendChild(newNode);
                newNode.childNodes[1].addEventListener("click", () => {
                    this.isDeselected(newNode, insParent);
                });
                break;}
            case "list":{
                newNode.classList.add("inserted-after");
                newNode.classList.add(`inserted-sel-after${this.c}`);
                insParentAfter.appendChild(newNode);
                newNode.childNodes[1].addEventListener("click", () => {
                    this.isDeselected(newNode, insParentAfter);
                });
            }
        }

        console.log(this.selElement);
        let tmpArr = [];
        this.data.forEach(el => {
            if(el != arr) tmpArr.push(el);
        });
        this.data = tmpArr;
        this.input.value = "";
        this.dropParent.style.display = "block";
        this.input.focus();
        this.emptyStr();        
    }

    isDeselected(elm, par){
        let insElems;
        (this.listedElStyle == "bubble") ? insElems = document.querySelectorAll(`.inserted-sel${this.c}`) : insElems = document.querySelectorAll(`.inserted-sel-after${this.c}`);
        par.innerHTML = "";
        let indTemp;
        insElems.forEach((el, ind) => {
            (el != elm) ? par.appendChild(el) : indTemp = ind;
        });
        let tmp = [];
        this.selElement.forEach((el, ind) => {
            (ind != indTemp) ? tmp.push(el) : this.data.push(el);
        });
        this.selElement = tmp;
        console.log(this.selElement);
        this.input.focus();
        this.emptyStr();  
    }

}