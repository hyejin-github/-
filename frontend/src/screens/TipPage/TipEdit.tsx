import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@components/common/s3Uploader/Editor";
import "./TipEdit.scss";
import noimg from "@images/noimg.svg";
import HoneyRecipe from "@images/HoneyRecipe.svg";
import HoneyTem from "@images/HoneyTem.svg";
import HoneyTip from "@images/HoneyTip.svg";
import ImgResizer from "@components/common/ImgUploader/ImgResizer";
import isImage from "@utils/isImage";
import { tipCreate } from "@apis/honeyTip";
import LoadingSpinner from "@images/LoadingSpinner.svg";
import X from "@images/X.svg";

function TipEdit() {
  const [sendFile, setSendFile] = useState<File | null>(null);
  const [thumnail, setThumnail] = useState("");
  const [category, setCategory] = useState("tip");
  const [errMsg, setErrMsg] = useState("");
  const [chk, setChk] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const imgInput = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const back = () => {
    navigate("/tip");
  };

  const clickInput = () => {
    imgInput.current?.click();
  };

  const fileread = () => {
    if (imgInput.current?.files) {
      const file = imgInput.current.files[0];

      if (file && isImage(file)) {
        setSendFile(file);
      }
    }
  };

  const receiveFile = useCallback((data: string) => {
    setThumnail(data);
  }, []);

  const changeCategory = (cate: string) => {
    setCategory(cate);
  };

  const chkForm = () => {
    if (!titleRef.current?.value) {
      setErrMsg("제목을 입력해주세요.");
      titleRef.current?.focus();
      return;
    }
    if (titleRef.current.value.length > 30) {
      setErrMsg("제목은 30자까지에요.");
      titleRef.current?.focus();
      return;
    }
    setSpinner(true);
    setChk(true);
  };

  const receiveValue = async (data: string) => {
    const payload = {
      category,
      title: titleRef.current?.value as string,
      content: data,
      bannerImg: thumnail.replace("data:image/jpeg;base64,", "")
    };
    const res = await tipCreate(payload);
    if (res.status === 500) {
      alert("글이 너무 길어요 ㅠㅠ");
      setSpinner(false);
      navigate(`/tip`);
    }
    navigate(`/tip/detail/${res}`);
  };

  return (
    <div id="tip-edit">
      <input type="file" accept="image/*" ref={imgInput} onChange={fileread} />
      {sendFile ? (
        <ImgResizer
          imgfile={sendFile}
          newImgfile={receiveFile}
          imgW={400}
          imgH={400}
        />
      ) : null}
      <div className="tip-header ">
        <div className="tip-header-title notoBold flex">
          <p>
            <span>꿀</span>팁<span> 쓰</span>기
          </p>
        </div>
        <div className="tip-header-category flex">
          <p className="category-label notoMid">Category</p>
          <button
            type="button"
            onClick={() => changeCategory("recipe")}
            className={`notoReg ${category === "recipe" ? "active" : null}`}
          >
            <img src={HoneyRecipe} alt="꿀시피" title="꿀시피" />
            <p className="notoReg">꿀시피</p>
          </button>
          <button
            type="button"
            onClick={() => changeCategory("tip")}
            className={`notoReg ${category === "tip" ? "active" : null}`}
          >
            <img src={HoneyTip} alt="꿀생" title="꿀생" />
            <p className="notoReg">꿀생</p>
          </button>
          <button
            type="button"
            onClick={() => changeCategory("item")}
            className={`notoReg ${category === "item" ? "active" : null}`}
          >
            <img src={HoneyTem} alt="꿀템" title="꿀템" />
            <p className="notoReg">꿀템</p>
          </button>
        </div>
        <div className="tip-header-preview flex justify-center">
          <button
            onClick={() => {
              setThumnail("");
            }}
            type="button"
            className={`tip-close ${!thumnail && "hide"}`}
          >
            <img src={X} alt="close" />
          </button>
          <button
            onClick={clickInput}
            type="button"
            className="tip-header-preview_container flex column justify-center align-center"
          >
            <p className="tip-header-preview_container-title notoMid">
              Thumnail
            </p>
            <div className="tip-header-preview_img flex justify-center align-center">
              {thumnail ? (
                <img
                  className="tip-header-preview_img-img"
                  src={thumnail}
                  alt="preview"
                />
              ) : (
                <img
                  className="tip-header-preview_img-img"
                  src={noimg}
                  alt="no-img"
                  title="preview"
                />
              )}
            </div>
            <span className="notoReg">
              jpg, png, gif, jpeg 파일만 지원해요.
            </span>
          </button>
        </div>
      </div>
      <div className="tip-content flex column align-center">
        <p className="notoMid">Content</p>
        <input
          ref={titleRef}
          className="tip-title"
          type="text"
          placeholder="제목은 30자까지 입력할 수 있어요."
        />
        {errMsg ? <span className="notoReg fs-16">{errMsg}</span> : null}

        <Editor editorValue={receiveValue} getValue={chk} update={`${""}`} />
      </div>
      {spinner ? (
        <div className="send flex">
          <img
            src={LoadingSpinner}
            className="loading-spinner"
            alt="로딩스피너"
          />
        </div>
      ) : (
        <div className="send flex notoReg">
          <button type="button" onClick={chkForm}>
            작성
          </button>
          <button className="cancle" type="button" onClick={back}>
            취소
          </button>
        </div>
      )}
    </div>
  );
}

export default TipEdit;
