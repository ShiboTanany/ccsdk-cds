/*
* ============LICENSE_START=======================================================
* ONAP : CDS
* ================================================================================
* Copyright (C) 2019 TechMahindra
*
* Modifications Copyright (C) 2019 IBM
*=================================================================================
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* ============LICENSE_END=========================================================
*/

import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IResources } from 'src/app/common/core/store/models/resources.model';
import { IResourcesState } from 'src/app/common/core/store/models/resourcesState.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../common/core/store/state/app.state';
import { A11yModule } from '@angular/cdk/a11y';
import { LoadResourcesSuccess } from 'src/app/common/core/store/actions/resources.action';
import { ISourcesData } from 'src/app/common/core/store/models/sourcesData.model';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { ResourceEditService } from '../resource-edit.service';

@Component({
  selector: 'app-sources-template',
  templateUrl: './sources-template.component.html',
  styleUrls: ['./sources-template.component.scss']
})
export class SourcesTemplateComponent implements OnInit {

    @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;
    options = new JsonEditorOptions(); 
    rdState: Observable<IResourcesState>;
    resources: IResources;
    option = [];
    sources:ISourcesData; 
    sourcesOptions = [];
    sourcesData = {};
    @Output() resourcesData = new EventEmitter();
    tempOption = [];
 
    constructor(private store: Store<IAppState>, private apiService: ResourceEditService) {
    this.rdState = this.store.select('resources');
    this.options.mode = 'text';
    this.options.modes = [ 'text', 'tree', 'view'];
    this.options.statusBar = false;     
 }

 ngOnInit() {
    this.rdState.subscribe(
      resourcesdata => {
        var resourcesState: IResourcesState = { resources: resourcesdata.resources, isLoadSuccess: resourcesdata.isLoadSuccess, isSaveSuccess: resourcesdata.isSaveSuccess, isUpdateSuccess: resourcesdata.isUpdateSuccess };
        this.resources=resourcesState.resources;
         if(resourcesState.resources.definition && resourcesState.resources.definition.sources) {
         this.sources = resourcesState.resources.definition.sources;
         }
        for (let key in this.sources) {
            let source = {
               name : key,
               data: this.sources[key]
            }
             this.sourcesOptions.push(source);    
        }
    })
 }

 onChange(item,$event) {
    var editedData =JSON.parse($event.srcElement.value);
    var originalSources = this.resources.sources;
     for (let key in originalSources){
        if(key == item){
            originalSources[key] = editedData;
        }
     }
     this.resources.sources = Object.assign({},originalSources);
 };
    
 // to remove this method
 selected(sourceValue){
   this.sourcesData= [];//this.sources[value];
   this.apiService.getModelType(sourceValue.value)
   .subscribe(data=>{
      console.log(data);
      data.forEach(item =>{
        if(typeof(item)== "object") {
           for (let key1 in item) {
              if(key1 == 'properties') {                  
                 let newPropOnj = {}
                 for (let key2 in item[key1]) {
                    console.log(item[key1][key2]);
                    let varType = item[key1][key2].type
                    // let property :  varType = 
                    newPropOnj[key2] = item[key1][key2];
                 }
              }
           }
        }
      });
      this.sourcesData = data;
      this.sourcesOptions.forEach(item=>{
         if(item.name == sourceValue.name) {
            item.data = data;
         }
      })       
     return this.sourcesData;
   })    
}    

 delete(item,i){
 	if(confirm("Are sure you want to delete this source ?")) {
    	var originalSources = this.resources.sources;
    	for (let key in originalSources){
     		if(key == item){    
      			delete originalSources[key];
      		}
     	}
    	this.resources.sources = Object.assign({},originalSources);
  		this.sourcesOptions.splice(i,1);
  	}     
 } 
  
 UploadSourcesData() {
  	this.resourcesData.emit(this.resources);        
  }
    
 drop(event: CdkDragDrop<string[]>) {
   if (!this.checkIfSourceExists(event.item.element.nativeElement.innerText)) {
      if (event.previousContainer === event.container) {
         moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
         transferArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex);
      }
      this.tempOption.forEach((item) => {
         if (item.name == event.item.element.nativeElement.innerText) {
            this.apiService.getModelType(item.value)
               .subscribe(data => {
                  console.log(data);
                  data.forEach(dataitem => {
                     if (typeof (dataitem) == "object") {
                        for (let key1 in dataitem) {
                           if (key1 == 'properties') {
                              let newPropObj = {};
                              newPropObj["name"] = event.item.element.nativeElement.innerText;
                              newPropObj['data'] = {};
                              let newSoruceObj = {};
                              for (let key2 in dataitem[key1]) {
                                 newSoruceObj[key2] = '';;
                              }
                              newPropObj['data']['properties'] = newSoruceObj;
                              this.sourcesOptions.forEach(sourcesOptionsitem => {
                                 if (sourcesOptionsitem.name == item.name) {
                                    sourcesOptionsitem.data = newPropObj['data'];
                                 }
                              });
                           }
                        }
                     }
                  });
            });
         }  
      });
   }
  }

  getResources() {
   this.apiService.getSources()
   .subscribe(data=>{
      console.log(data);
      for (let key in data[0]) {
         let sourceObj = { name: key, value: data[0][key] }
         this.option.push(sourceObj);
         this.tempOption.push(sourceObj); 
     }
   }, error=>{
      console.log(error);
   })
  }

  checkIfSourceExists(sourceName) {
   let sourceExists: boolean = false;
   this.sourcesOptions.forEach(item => {
      if (item.name == sourceName) {
         sourceExists = true;
      }
   });
   return sourceExists;
}
}
