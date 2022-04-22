//yarn add node-geocoder
const nodeGeocoder = require("node-geocoder");
const parseDMS = require("parse-dms");
const mdls = require("mdls");
const Transloadit = require("transloadit")
let latitude = 0;
let longitude = 0;

//meta data
(async () => {
  const metaData = async () => {
    try {
      const data = await mdls("./blog/IMG_0106.HEIC");
      latitude = data.ItemLatitude;
      longitude = data.ItemLongitude;
    } catch (err) {
      console.log("Error", err);
    }
  };
  await metaData();
  console.log(latitude, longitude);

  // Geocode
  const options = {
    provider: "openstreetmap",
  };
  let geoCoder = nodeGeocoder(options);
  let address = await geoCoder
    .reverse({ lat: latitude, lon: longitude })
    .then((res) => {
      let addressArray = res[0].formattedAddress.split(", ");
      console.log(addressArray)
      let streetAddress = `${addressArray[0]} ${addressArray[1]}, ${addressArray[3]}, ${addressArray[5]}`
      return streetAddress
    })
    .catch((err) => {
      console.log(err);
    });
  console.log(address)
    //transloadit
    const transloadit = new Transloadit({
      authKey   : "6f9ece25ada84dde9bbcfdcb652b5b6a",
      authSecret: "3e185a5e8181ee82b31c07e5597afdde044309c1" 
    })
  
    const assemblyStatus = await transloadit.createAssembly({
      waitForCompletion: true,
      files: {
        file1: "./blog/IMG_0106.HEIC"
      },
      params           : {
        template_id: 'e0626e70bd11401d885ffb664149516a',
        fields: {address: address}
      },
    })
    
})();
