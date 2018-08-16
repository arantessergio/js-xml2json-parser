const parser = require('xml-js');

const xmlSample = `
<?xml version="1.0" encoding="utf-8"?>
<MainEntity>
  <InnerEntity>
    <SimpleAttribute01>Some value for SimpleAttribute01</SimpleAttribute01>
    <SimpleAttribute02>Some value for SimpleAttribute02</SimpleAttribute02>
    <ObjectArray>
      <SimpleObject>
        <Id>777</Id>
        <Description>Some description to simple object.</Description>
      </SimpleObject>
      <SimpleObject>
        <Id>888</Id>
        <Description>Some description to another simple object.</Description>
      </SimpleObject>
    </ObjectArray>
  </InnerEntity>
</MainEntity>
`;

const primalJson = JSON.parse(parser.xml2json(xmlSample, {
    compact: true,
    spaces: 4,
    textKey: 'value'
}));

const refineJson = (json, entity, subEntity) => {

    let result = {};


    if (json) {

        if (entity) {
            json = json[entity]
        }

        delete json._attributes;

        if (subEntity) {
            json = json[subEntity]
        }

        const keys = Object.keys(json);

        for (let i in keys) {

            const key = keys[i];

            const obj = json[key];

            const secondKeys = Object.keys(obj);

            if (obj.value) {
                result[key] = obj.value;
            } else if (secondKeys && secondKeys.length) {

                for (let j in secondKeys) {

                    const secondKey = secondKeys[j];

                    const secondObj = obj[secondKey];

                    if (Array.isArray(secondObj)) {

                        const arr = [];

                        for (let z in secondObj) {

                            arr.push(refineJson(secondObj[z]));

                        }

                        result[key] = arr;

                    } else {
                        result[key] = refineJson(secondObj);
                    }

                }

            }

        }
    }

    return result;
    
};

console.log(refineJson(primalJson, 'MainEntity', 'InnerEntity'));