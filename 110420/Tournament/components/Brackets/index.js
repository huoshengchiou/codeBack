import React, { useContext, useEffect, useRef, useState } from 'react';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { TournamentContext } from '../../TournamentContext';
import Button from "components/DesignSystem/Input/Button";

import classes from './style.module.scss';

import Basic from "./Basic"
import FreeForAll from "./FreeForAll"

const Brackets = (props) => {
  const { renderT8tInfo, intl, match } = useContext(TournamentContext);
  const { bracket_type } = renderT8tInfo;

  const fetchListener = useRef();

  const [printType, setPrintType] = useState("");
  const [doPrint, setDoPrint] = useState(false);

  useEffect(() => {
    return () => {
      if (fetchListener.current) {
        fetchListener.current.unsubscribe();
      }
    };
  }, [match.params.t8t_serial]);

  useEffect(() => {
    if (printType !== "") {
      setTimeout(() => {
        setDoPrint(true);
      }, 50);
    }
  }, [printType])

  useEffect(() => {
    if (doPrint) {
      printMe(printType);
    }
  }, [doPrint])

  if (!renderT8tInfo) {
    return null;
  }

  const getComponent = (type) => {
    switch (type) {
      case "single":
      case "double":
        return <Basic></Basic>;
      case "ffa":
        return <FreeForAll></FreeForAll>;
    }
  }

  const input = document.getElementById('capture');
  const printMe = (type) => {
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
      console.log("Firefox");
      document.getElementById('capture').style.width = '-moz-fit-content';
    } else if (navigator.userAgent.toLowerCase().indexOf('edge') > -1) {
      document.getElementById('capture').style.width = 'auto';
      document.getElementById('capture').style.display = 'inline-block';
    } else {
      document.getElementById('capture').style.width = 'fit-content';
    }

    let elements = [];
    if (bracket_type === "ffa") {
      elements = document.querySelectorAll("[class^=style_tableBody]");
      elements.forEach(item => {
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
          item.style.height = "-moz-fit-content";
        } else if (navigator.userAgent.toLowerCase().indexOf('edge') > -1) {
          item.style.height = "auto";
        } else {
          item.style.height = "fit-content";
        }

      })
    }

    const originalHeight = document.getElementById('capture').offsetHeight;
    let pixelRatio = 1;
    // Chrome limits canvas max length to 16384px, jsPDF limits to 14400px
    const maxHeight = type === "pdf" ? 14400 : 16384;
    // Change display pixel ratio to resize the content if exceeds limit 
    if (originalHeight > maxHeight) {
      pixelRatio = maxHeight / originalHeight;
    }


    html2canvas(input, {
      backgroundColor: "#000000",
      scale: pixelRatio,
      allowTaint: true,
      useCORS: true,
      logging: true,
      // jsPDF is 72dpi, screen is 96dpi, 2x will result finer image
      dpi: type === "pdf" ? 144 : 96,
    }).then((canvas) => {
      switch (type) {
        case "pdf": {
          // put jpg into pdf (not png) for compatibility with chrome
          const imgData = canvas.toDataURL('image/jpeg');
          console.log(imgData);
          const orientation = canvas.width >= canvas.height ? "l" : "p";
          const pdf = new jsPDF({
            orientation: orientation,
            unit: "pt",
            format: [canvas.width, canvas.height],
            compress: false
          });
          pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
          pdf.save(`Bracket - ${renderT8tInfo.t8t_lite.name}.pdf`);
          break;
        }
        case "jpg": {
          const imgData = canvas.toDataURL('image/jpeg');
          console.log(imgData);
          const link = document.createElement("a");
          link.download = `Bracket - ${renderT8tInfo.t8t_lite.name}.jpg`;
          link.href = imgData;
          link.click();
          break;
        }
        case "png": {
          const imgData = canvas.toDataURL('image/png');
          console.log(imgData);
          const link = document.createElement("a");
          link.download = `Bracket - ${renderT8tInfo.t8t_lite.name}.png`;
          link.href = imgData;
          link.click();
          break;
        }
        default:
          break;
      }
      setDoPrint(false);
      setPrintType("");
    });

    if (bracket_type === "ffa") {
      elements.forEach(item => {
        item.style.height = "560px";
      })
    }

    document.getElementById('capture').style.width = "auto";
    if (window.navigator.userAgent.toLocaleLowerCase().indexOf("edge") > -1) {
      document.getElementById('capture').style.removeProperty("display");
    }
  }

  return (
    <>
      <div className={classes.printBtn}>
        <Button title={intl.formatMessage({ id: 'Brackets_Export' })} theme="dark_1" onClick={() => setPrintType("pdf")} isLoading={printType === "" ? false : true} />
        {/* <Button title="Export JPEG" theme="dark_1" onClick={() => setPrintType("jpg")} isLoading={printType === "" ? false : true} /> */}
        {/* <Button title="Export PNG" theme="dark_1" onClick={() => setPrintType("png")} isLoading={printType === "" ? false : true} /> */}
      </div>
      <div id="capture" className={classes.boxContainer}>
        {getComponent(bracket_type)}
      </div>
    </>
  )
}

export default Brackets