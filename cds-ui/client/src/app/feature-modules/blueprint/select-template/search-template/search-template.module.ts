/*
============LICENSE_START==========================================
===================================================================
Copyright (C) 2019 IBM Intellectual Property. All rights reserved.
===================================================================

Unless otherwise specified, all software contained herein is licensed
under the Apache License, Version 2.0 (the License);
you may not use this software except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
============LICENSE_END============================================
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFromDatabaseComponent } from './search-from-database/search-from-database.component';
import { SearchTemplateComponent } from './search-template.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from 'src/app/common/modules/app-material.module';
import { SharedModule} from 'src/app/common/shared/shared.module';
// import { SelectTemplateService } from 'src/app/feature-modules/blueprint/select-template/select-template.service';
  
@NgModule({
  declarations: [
    SearchTemplateComponent,
    SearchFromDatabaseComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppMaterialModule,
    SharedModule   
  ],
  exports:[
    SearchTemplateComponent,
    SearchFromDatabaseComponent
    ],
  // providers:[ SelectTemplateService]
})
export class SearchTemplateModule { }
