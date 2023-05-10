import React, { useEffect,useState } from "react";
var convert = require("xml-js");

const App = () => {
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [devicePort, setDevicePort] = useState("11100");
  const [device, setDevice] = useState("11100");
  const [pidData, setPidData] = useState("11100");
  const mantraPorts = [
    "11100",
    "11101",
    "11102",
    "11103",
    "11104",
    "11105",
    "11106",
  ];

  const discoverDevice = () => {
    let found = false;
    for (let i = 0; i < mantraPorts.length && !found; i++) {
      const currentPort = mantraPorts[i];
      try {
        discoverDeviceReq(currentPort, () => {
          found = true;
          setDevicePort(currentPort);
          getDeviceInfo(currentPort);
        });
      } catch (error) {}
    }
  };

  function discoverDeviceReq(port, callback) {
    let url;
    if (device == 0) {
      url = `https://localhost:${port}/rd/info`;
    }
    if (device == 1) {
      url = `https://localhost:${port}/getDeviceInfo`;
    }
    console.log(url);
    var xhr;
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      // If Internet Explorer, return version number
      //IE browser
      xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
    } else {
      //other browser
      xhr = new XMLHttpRequest();
    }

    //
    xhr.open("DEVICEINFO", url, true);

    xhr.onreadystatechange = function () {
      // if(xhr.readyState == 1 && count == 0){
      //	fakeCall();
      //}
      if (xhr.readyState == 4) {
        var status = xhr.status;

        if (status == 200) {
          var result1 = convert.xml2json(xhr.responseText, {
            compact: true,
            spaces: 4,
          });
          const data1 = JSON.parse(result1);
          if (
            data1.DeviceInfo.additional_info.Param[0]._attributes.value == ""
          ) {
          } else {
            callback();
          }
        } else {
          console.log(xhr.response);
        }
      }
    };

    xhr.send();
  }

  function getDeviceInfo(port) {
    let url;
    if (device == 0) {
      url = `https://localhost:${port}/rd/info`;
    }
    if (device == 1) {
      url = `https://localhost:${port}/getDeviceInfo`;
    }
    var xhr;
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      // If Internet Explorer, return version number
      //IE browser
      xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
    } else {
      //other browser
      xhr = new XMLHttpRequest();
    }

    //
    xhr.open("DEVICEINFO", url, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        var status = xhr.status;

        if (status == 200) {
          var result1 = convert.xml2json(xhr.responseText, {
            compact: true,
            spaces: 4,
          });
          const data1 = JSON.parse(result1);
          if (
            data1.DeviceInfo.additional_info.Param[0]._attributes.value == ""
          ) {
            alert("device is not ready");
          } else {
            alert("device is ready to use");
          }
          setDeviceInfo(data1);
        } else {
          console.log(xhr.response);
        }
      }
    };

    xhr.send();
  }

  function morphoCapture() {
    var url = `https://localhost:${devicePort}/capture`;
    let PIDOPTS =
      '<PidOptions ver="1.0">' +
      '<Opts fCount="1" fType="2" iCount="" iType="" pCount="" pType="" format="0" pidVer="2.0" timeout="10000" otp="" wadh="" posh=""/>' +
      "</PidOptions>";

    var xhr;
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      // If Internet Explorer, return version number
      //IE browser
      xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
    } else {
      //other browser
      xhr = new XMLHttpRequest();
    }

    xhr.open("CAPTURE", url, true);
    xhr.setRequestHeader("Content-Type", "text/xml");
    xhr.setRequestHeader("Accept", "text/xml");

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        var status = xhr.status;
        //parser = new DOMParser();
        if (status == 200) {
          var test1 = xhr.responseText;
          var test2 = test1.search("errCode");
          var test6 = getPosition(test1, '"', 2);
          var test4 = test2 + 9;
          var test5 = test1.slice(test4, test6);
          // conversion

          if (test5 > 0) {
            alert(xhr.responseText);
            //document.getElementById('text').value = xhr.responseText;
          } else {
            alert("Captured Successfully");
            var result1 = convert.xml2json(test1, { compact: true, spaces: 4 });
            setPidData(JSON.parse(result1));
          }
        } else {
          console.log(xhr.response);
        }
      }
    };

    xhr.send(PIDOPTS);
  }

  function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
  }

  function mantraCapture() {
    var url = `https://localhost:${devicePort}/rd/capture`;
    let PIDOPTS =
      '<?xml version="1.0"?> <PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" format="0"   pidVer="2.0" timeout="10000" posh="UNKNOWN" env="P" wadh="" /> <CustOpts><Param name="mantrakey" value="undefined" /></CustOpts> </PidOptions>';

    var xhr;
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      // If Internet Explorer, return version number
      //IE browser
      xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
    } else {
      //other browser
      xhr = new XMLHttpRequest();
    }

    xhr.open("CAPTURE", url, true);
    xhr.setRequestHeader("Content-Type", "text/xml");
    xhr.setRequestHeader("Accept", "text/xml");

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        var status = xhr.status;
        //parser = new DOMParser();
        if (status == 200) {
          var test1 = xhr.responseText;
          var test2 = test1.search("errCode");
          var test6 = getPosition(test1, '"', 2);
          var test4 = test2 + 9;
          var test5 = test1.slice(test4, test6);
          // conversion
          var result1 = convert.xml2json(test1, { compact: true, spaces: 4 });
          setPidData(JSON.parse(result1));
          if (test5 > 0) {
            alert(xhr.responseText);
            //document.getElementById('text').value = xhr.responseText;
          } else {
            alert("Captured Successfully");
            var result1 = convert.xml2json(test1, { compact: true, spaces: 4 });
            setPidData(JSON.parse(result1));
            // callback(JSON.parse(result1));
            //document.getElementById('text').value = "Captured Successfully";
          }
        } else {
          console.log(xhr.response);
        }
      }
    };

    xhr.send(PIDOPTS);
  }

  const capture = () => {
    if (
      !deviceInfo ||
      !deviceInfo.DeviceInfo ||
      !deviceInfo.DeviceInfo.additional_info ||
      deviceInfo.DeviceInfo.additional_info.Param.length == 0
    ) {
      alert("Please choose device or check device is ready or not");
    } else if (
      device == 0 &&
      deviceInfo.DeviceInfo.additional_info.Param[0]._attributes.value != ""
    ) {
      mantraCapture();
    } else if (
      device == 1 &&
      deviceInfo.DeviceInfo.additional_info.Param[0]._attributes.value != ""
    ) {
      morphoCapture();
    } else {
      alert("Please choose device or check device is ready or not");
    }
  };
  useEffect(() => {
    discoverDevice()
  }, [])
  return (
    <div>
      <button onClick={capture}>Capture</button>
    </div>
  );
};

export default App;
