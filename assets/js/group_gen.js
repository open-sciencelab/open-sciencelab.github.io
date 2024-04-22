// generate publication list from data.json
"use strict"


function readTextFile(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, false); //fase for synchronous requests
  rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
        callback(rawFile.responseText);
      }
  }
  rawFile.send(null);
}
let journal_data;
let earth_data;
let lifescience_data;
readTextFile('https://raw.githubusercontent.com/openscience-lab/openscience-lab.github.io/main/assets/js/data.json', function(text){
  let data = JSON.parse(text);
  journal_data = data.journals;
  earth_data = data.AI4earth;
  lifescience_data = data.lifesciences;
});

function journalPubItemConstructor(pubitem) {
  function filter_mandatory_members(value, index, arr) {
    let mandatory_members = ["authors", "title", "publisher", "image", "full_text", "link_group"];
    return !mandatory_members.includes(value);
  }
  let all_members = Object.keys(pubitem);
  all_members = all_members.filter(filter_mandatory_members);
  let obj;
  obj = document.createElement("template");
  let additional_link_template = `[<a class="aLink" href="LINK_TO_REPLACE" >TEXT_TO_REPLACE</a>]`;
  let html_template = ` 
  <div>
    <div class="row">
      <div class="small-4 column">
          <a href="LINK_GROUP">
            <img src="IMAGE" style="width: 100%">
          </a>
      </div>
      <div class="small-8 column">
        <p>
          <b>TITLE</b>
          <br>
          ADDITIONAL_LINKS
          <br>
        </p>
      </div>
        
    </div>
    <hr>
  </div>
  `;
  let additional_links = "";
  let num_links = all_members.length;
  for (let i = 0; i < num_links; i++) {
    additional_links = additional_links.concat(
      additional_link_template
        .replace("LINK_TO_REPLACE", pubitem[all_members[i]])
        .replace("TEXT_TO_REPLACE", all_members[i])
    );
  }
  obj.innerHTML = html_template
    .replace("AUTHORS", pubitem.authors)
    .replace("TITLE", pubitem.title)
    .replace("JOURNAL", pubitem.publisher)
    .replace("IMAGE", pubitem.image)
    .replace("LINK_GROUP", pubitem.link_group)
    .replace("ADDITIONAL_LINKS", additional_links)
    .replace(
      `<img style="width: 336Px;" alt="Wanli" src="" width="336px" height="200px">`,
      ""
    );

  return obj.content.firstElementChild;
}

//Journal list generation
let journal_list = document.getElementById("journal_list");
let pubitem;
for (pubitem of journal_data.reverse()) {
  journal_list.prepend(journalPubItemConstructor(pubitem))
}

//Conference list generation
let earth_list = document.getElementById("earth_list");
for (pubitem of earth_data.reverse()) {
  earth_list.prepend(journalPubItemConstructor(pubitem))
}

//lifescience list generation
let lifescience_list = document.getElementById("lifescience_list");
for (pubitem of lifescience_data.reverse()) {
  lifescience_list.prepend(journalPubItemConstructor(pubitem))
}
