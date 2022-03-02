// var paywall = require("./lib/paywall");
// setTimeout(() => paywall(12345678), 5000);

require("component-responsive-frame/child");
require("component-leaflet-map");

var zoom = document.getElementById("interactive").offsetWidth > 500 ? 11 : 10;

const mainCD = require("./districts/current_districts.geo.json");
const prop1 = require("./districts/optionOne.json");
const prop2 = require("./districts/optionTwo.json");
const prop3 = require("./districts/optionThree.json");
const prop4 = require("./districts/optionFour.json");


var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;

// var ich = require("icanhaz");
// var templateFile = require("./_popup.html");
// var templateFileProp = require("./_popupPro.html");
// ich.addTemplate("popup", templateFile);
// ich.addTemplate("popupProp", templateFileProp);
var focused = false;

// const colorBlocks = document.querySelectorAll('.color');
// var allSpans = document.querySelector('#legendCon').getElementsByTagName('span');


// mainCD.features.forEach(function(f) {
//   ["data_Pop_Difference"].forEach(function(prop) {
//     f.properties["Diff_string"] = f.properties[prop];
//     f.properties[prop] = Number(f.properties[prop].replace(/,/, ""));
//     // console.log(parseInt(f.properties[prop]));
//
//   });
// });


var arrayLegend = {
  main: "OBJECTID",
  prop1: "OBJECTID",
  prop2: "OBJECTID",
  prop3: "OBJECTID",
  prop4: "OBJECTID",
  main_light: "none"
};

var getColor = function(d, array) {
  var value = d;
  // console.log(value);
  var thisArray = arrayLegend[array];
  let chosenColorArray = orangeArray;

  // for (let h = 0; h < colorBlocks.length; h++) {
  //   colorBlocks[h].style.backgroundColor = chosenColorArray[h];
  // }


  if (typeof value == "string") {
    value = Number(value.replace(/,/, ""));

  }
  if (typeof value != "undefined") {
    return value >= thisArray[5] ? chosenColorArray[6] :
           value >= thisArray[4] ? chosenColorArray[5] :
           value >= thisArray[3] ? chosenColorArray[4] :
           value >= thisArray[2] ? chosenColorArray[3] :
           value >= thisArray[1] ? chosenColorArray[2] :
           value >= thisArray[0]  ? chosenColorArray[1] :
           chosenColorArray[0] ;
  } else {
    return "gray"
  }
};

const commafy = s => (s * 1).toLocaleString().replace(/\.0+$/, "");

const orangeArray = ['#3A1E00','#703a00', '#bd934c', '#e8d8a8', '#CFECE7', "#51a8a0", "#03524b", "#002623"];

const numbers = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th"];

function restyleLayer(propertyName) {
  geojson.eachLayer(function(featureInstanceLayer) {
      var propertyValue = featureInstanceLayer.feature.properties[propertyName];
      // var colorArray = propertyName + "_array";

      // Your function that determines a fill color for a particular
      // property name and value.
      // var myFillColor = getColor(propertyValue, colorArray);
      featureInstanceLayer.setStyle({
          fillColor: orangeArray[propertyValue - 1],
          opacity: 1,
          color: '#000',
          fillOpacity: 0.6,
          weight: 3
      });
  });
}

function restyleLayerProp(map, propertyName) {
  map.eachLayer(function(featureInstanceLayer) {
    var propertyValue = featureInstanceLayer.feature.properties[propertyName];
      // Your function that determines a fill color for a particular
      // property name and value.
      featureInstanceLayer.setStyle({
          fillColor: orangeArray[propertyValue - 1],
          opacity: 1,
          color: "none",
          fillOpacity: 0.6,
          weight: 0
      });
  });
}


function restyleLayerMainOutline(propertyName) {
  geojson_outline.eachLayer(function(featureInstanceLayer) {
      // Your function that determines a fill color for a particular
      // property name and value.
      featureInstanceLayer.setStyle({
          fillColor: "none",
          opacity: 1,
          color: '#000',
          fillOpacity: 0.7,
          weight: 3
      });
  });
}


var onEachFeature = function(feature, layer) {
  // layer.bindPopup(ich.popup(feature.properties))
  layer.bindTooltip(`${numbers[feature.properties.OBJECTID - 1]}`, {permanent: true, className: "my-label", direction: "center"});
  layer.on({
    mouseover: function(e) {
      layer.setStyle({ fillOpacity: 0.9 });
    },
    mouseout: function(e) {
      if (focused && focused == layer) { return }
      layer.setStyle({ fillOpacity: 0.7 });
    }
  });
};

// var onEachFeatureOutline = function(feature, layer) {
//   // layer.bindPopup(ich.popup(feature.properties))
//   layer.on({
//     mouseover: function(e) {
//       layer.setStyle({ fillOpacity: 0.9 });
//     },
//     mouseout: function(e) {
//       if (focused && focused == layer) { return }
//       layer.setStyle({ fillOpacity: 0.7 });
//     }
//   });
// };

var onEachFeatureProp = function(feature, layer) {
  // var offsetFour = feature.properties.DISTRICT === "4" ? 35 : 0;
  layer.bindTooltip(`${numbers[feature.properties.OBJECTID - 1]}`, {permanent: true, className: "my-label", direction: "center", offset: [0, 0]});
  // layer.bindPopup(ich.popupProp(feature.properties))
  layer.on({
    mouseover: function(e) {
      layer.setStyle({ weight: 2, fillOpacity: 0.8 });
    },
    mouseout: function(e) {
      if (focused && focused == layer) { return }
      layer.setStyle({ weight: 1, fillOpacity: 0.5 });
    }
  });
};


var geojson = L.geoJson(mainCD, {
  onEachFeature: onEachFeature
}).addTo(map);

var geojson_outline = L.geoJson(mainCD, {
  // onEachFeature: onEachFeatureOutline
});

var geojsonPro1 = L.geoJson(prop1, {
  onEachFeature: onEachFeatureProp
});

var geojsonPro2 = L.geoJson(prop2, {
  onEachFeature: onEachFeatureProp
});

var geojsonPro3 = L.geoJson(prop3, {
  onEachFeature: onEachFeatureProp
});

var geojsonPro4 = L.geoJson(prop4, {
  onEachFeature: onEachFeatureProp
});

var allLayers = [geojson, geojson_outline, geojsonPro1, geojsonPro2, geojsonPro3, geojsonPro4];

var mapLayers = {
  main: geojson,
  prop1: geojsonPro1,
  prop2: geojsonPro2,
  prop3: geojsonPro3,
  prop4: geojsonPro4,
};

document.querySelectorAll(".buttonCon .button").forEach(el => el.addEventListener('click', () => {
  document.querySelectorAll(".buttonCon .button").forEach(el => el.classList.remove("active"));
  el.classList.add("active");

  allLayers.forEach(element => map.removeLayer(element));

  // map.removeLayer(allLayers);

  // map.removeLayer(geojson);
  // map.removeLayer(geojson_outline);
  // map.removeLayer(geojsonPro1);
  // map.removeLayer(geojsonPro2);
  // map.removeLayer(geojsonPro3);
  // map.removeLayer(geojsonPro4);



  if(el.id === "main"){
    // document.querySelector("#legendCon").style.visibility = "visible";
    map.addLayer(geojson);
    restyleLayer(arrayLegend[el.id]);
  } else {
    map.addLayer(mapLayers[el.id]);
    restyleLayerProp(mapLayers[el.id], arrayLegend[el.id]);

    map.addLayer(geojson_outline);
    restyleLayerMainOutline(arrayLegend["main_light"]);
  }

  // filterMarkers(el.id);
}));


map.setView(new L.LatLng(47.615565196999036, -122.33382194491907), zoom);

//kick things off//
restyleLayer(arrayLegend["main"]);
