import { Component, OnInit } from '@angular/core';
import { PackageCreationService } from '../package-creation.service';
import { MetaDataTabModel } from '../mapping-models/metadata/MetaDataTab.model';
import { PackageCreationStore } from '../package-creation.store';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-metadata-tab',
    templateUrl: './metadata-tab.component.html',
    styleUrls: ['./metadata-tab.component.css']
})
export class MetadataTabComponent implements OnInit {
    packageNameAndVersionEnables = true;
    counter = 0;
    tags = new Set<string>();
    customKeysMap = new Map();
    modes: any[] = [
        { name: 'Designer Mode', style: 'mode-icon icon-designer-mode' }];
    /*  {name: 'Scripting Mode', style: 'mode-icon icon-scripting-mode'},
      {name: 'Generic Script Mode', style: 'mode-icon icon-generic-script-mode'}];*/
    modeType = this.modes[0].name;
    private metaDataTab: MetaDataTabModel = new MetaDataTabModel();
    private errorMessage: string;

    constructor(
        private route: ActivatedRoute,
        private packageCreationService: PackageCreationService,
        private packageCreationStore: PackageCreationStore
    ) {

    }

    ngOnInit() {
        this.metaDataTab.templateTags = this.tags;
        this.metaDataTab.mapOfCustomKey = this.customKeysMap;
        this.metaDataTab.mode = this.modeType;

        const id = this.route.snapshot.paramMap.get('id');
        id ? this.packageNameAndVersionEnables = false :
            this.packageNameAndVersionEnables = true;
        this.packageCreationStore.state$.subscribe(element => {

            if (element && element.metaData) {

                this.metaDataTab.name = element.metaData.name;
                this.metaDataTab.version = element.metaData.version;
                this.metaDataTab.description = element.metaData.description;
                this.tags = element.metaData.templateTags;
                this.metaDataTab.templateTags = this.tags;
                console.log(element);
                if (element.metaData.mode && element.metaData.mode.includes('DEFAULT')) {
                    this.metaDataTab.mode = 'Designer Mode';
                    this.modeType = this.metaDataTab.mode;
                }

                this.customKeysMap = element.metaData.mapOfCustomKey;
                // this.tags = element.metaData.templateTags;

            }
        });
    }

    removeTag(value) {
        // console.log(event);
        this.tags.delete(value);
    }

    addTag(event) {
        const value = event.target.value;
        console.log(value);
        if (value && value.trim().length > 0) {
            event.target.value = '';
            this.tags.add(value);
        }
    }

    removeKey(event, key) {
        console.log(event);
        this.customKeysMap.delete(key);
    }

    addCustomKey() {
        // tslint:disable-next-line: no-string-literal
        const key = document.getElementsByClassName('mapKey')[0];
        // tslint:disable-next-line: no-string-literal
        const value = document.getElementsByClassName('mapValue')[0];

        // tslint:disable-next-line: no-string-literal
        if (key['value'] && value['value']) {
            // tslint:disable-next-line: no-string-literal
            this.customKeysMap.set(key['value'], value['value']);
            // tslint:disable-next-line: no-string-literal
            key['value'] = '';
            // tslint:disable-next-line: no-string-literal
            value['value'] = '';
        }
    }

    validatePackageNameAndVersion() {
        if (this.metaDataTab.name && this.metaDataTab.version) {
            this.packageCreationService.checkBluePrintNameAndVersion(this.metaDataTab.name, this.metaDataTab.version).then(element => {
                if (element) {
                    this.errorMessage = 'the package with name and version is exists';
                } else {
                    this.errorMessage = ' ';
                }
            });
        }

    }

    saveMetaDataToStore() {
        this.packageCreationStore.changeMetaData(this.metaDataTab);
    }
}
