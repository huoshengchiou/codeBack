import React, { useState, useEffect, useRef, Fragment } from 'react';
import classes from "./styles.module.scss";
import moment from 'moment-timezone';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withRouter, Link } from "react-router-dom";
import { from } from 'rxjs';

//style_component from storybook
import Textfield from 'components/DesignSystem/Input/TextField';
import Dropdown from 'components/DesignSystem/Input/Dropdown';
import Checkbox from 'components/DesignSystem/Input/Checkbox';
import Button from 'components/DesignSystem/Input/Button';
import Textarea from 'components/DesignSystem/Input/Textarea'
import DialogBlock from 'components/blocks/DialogBlock';
import RangePicker from "components/DesignSystem/Input/DatePicker/RangePicker";
import CalendarDatePicker from "components/DesignSystem/Input/DatePicker/CalendarDatePicker";

//跳窗
import { withPopWindowConsumer } from 'components/layouts/PopWindow/Context';
//上傳成功跳窗component
import { withDialogConsumer } from 'components/layouts/Dialog/Context';
import { withConfigConsumer } from 'contexts/Config';

//Icons
import { LoactionIcon, DeleteIcon } from 'components/utils/Icons';
//apis
import { postCareerApplyAPI } from 'apis/careers';

import { Controller, useForm } from "react-hook-form";
//?
// import Loading from 'components/utils/Loading';

// const validConfig = {
//     first_name: {
//         required: true,
//     },
//     last_name: {
//         required: true
//     },
//     email: {
//         required: true,
//     },
//     country_code: {
//         required: true
//     }
// }

//input dropdown //phone number
// const PhList = [
//     {
//         id: 0,
//         key: '+866',
//         name: '台灣 +866',
//     },
//     {
//         id: 1,
//         key: '+1',
//         name: '美 +1',
//     },
//     {
//         id: 2,
//         key: '+852',
//         name: '香港 +852',
//     },
//     {
//         id: 3,
//         key: '+81',
//         name: '日本 +81',
//     },
// ];



const ApplyCareer = (props) => {
    // console.log(props.title)
    //跳窗需要的style
    const { style, career_id, popWindowData, dialogData, intl, title, configData } = props;
    const fetchListener = useRef();
    const uploadResumeRef = useRef(null);
    const submitRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, watch, errors, setValue, control, formState, unregister } = useForm({ mode: "onChange" });
    const { isValid } = formState;


    //input dropdown //EDU
    const EducationList = [
        {
            id: 0,
            key: intl.formatMessage({ id: 'Careers_Doctor' }),
            name: intl.formatMessage({ id: 'Careers_Doctor' }),
        },
        {
            id: 1,
            key: intl.formatMessage({ id: 'Careers_Master' }),
            name: intl.formatMessage({ id: 'Careers_Master' }),
        },
        {
            id: 2,
            key: intl.formatMessage({ id: 'Careers_Bachelor' }),
            name: intl.formatMessage({ id: 'Careers_Bachelor' }),
        },
        {
            id: 3,
            key: intl.formatMessage({ id: 'Careers_Others' }),
            name: intl.formatMessage({ id: 'Careers_Others' }),
        },
    ];

    //form info

    // career_id
    // first_name
    // last_name
    // email
    // phone_no
    // birthday


    // educations
    // { [
    //     school:
    //     degree:
    //     field_of_study:
    //     edu_start_date:
    //     edu_end_date:
    //  ], …}

    //  experiences
    //  { [
    //     canpany_name:
    //     job_title:
    //     exp_start_date:
    //     exp_end_date:
    //     currently_work: boolean
    //  ], …}
    // resume	
    // MultipartFile[]. 0 or more.
    // portfolio
    // content
    //fileupload
    const fakeactive = () => {
        //catch real input DOM
        if (uploadResumeRef !== null) {
            uploadResumeRef.current.click();
        }
    }
    //uploadinfo
    const [continueupload, setContinueUpload] = useState(true)
    //目前真實上傳檔案
    const [saveFiles, setSaveFiles] = useState([]);
    //render file list
    const [renderfilelist, setRenderFileList] = useState([])
    //當上傳檔案內容改變時，重新設定render arr
    useEffect(() => {
        //紀錄目前總檔案大小
        let limitfilesize = 0
        //紀錄目前檔案數量
        const limitfileslength = saveFiles.length
        const renderArr = saveFiles.map(val => {
            const obj = { name: val.name, size: returnFileSize(val.size) };
            limitfilesize += val.size
            return obj;
        })

        // 上傳檔案大小限制5000kb且數量<10
        if (limitfilesize / 1024 > 5000 || limitfileslength > 10) {
            setContinueUpload(false)
            console.log('not allow upload')
        }

        //重設render
        setRenderFileList(renderArr);
        //更新最終FORM上傳file
        setValue('resume_file', saveFiles);
        return () => {

        }
    }, [saveFiles])
    // { name: 'name1', size: 'size1' }, { name: 'name2', size: 'size2' }


    // 上傳檔案管理
    const handleResumeUpload = (e) => {
        const saveFilesNames = []
        //檔案數量限制
        if (e.target.files === 0 || e.target.files.length > 10)
            return;
        //TODO::muti files
        //e.target.files轉type arr 進行處理
        // User放進來的files一律進入
        const inputFiles = []
        for (let i = 0; i < e.target.files.length; i++) {
            inputFiles.push(e.target.files[i])
        }
        // 把外部真實上傳arr檔案名稱取出組合檔名過濾陣列
        saveFiles.forEach(val => {
            saveFilesNames.push(val.name)
        })

        //比對外部arr剔除重覆，導入外部arr
        const filterFiles = inputFiles.filter(file => saveFilesNames.indexOf(file.name) === -1);
        setSaveFiles([...saveFiles, ...filterFiles]);
        // setValue('resume_file', e.target.files[0]);
        // triggerValidation('resume_file');

    }


    // ------------------------------clear upload files---------------------------------

    const clearupload = (filename) => {
        //剔除檔名重覆檔案
        const delFiles = saveFiles.filter(file => file.name !== filename);
        setSaveFiles(delFiles)
    }

    //file size calculator
    function returnFileSize(number) {
        if (number < 1024) {
            return `${number}bytes`;
        } if (number > 1024 && number < 1048576) {
            return `${(number / 1024).toFixed(2)}KB`;
        } if (number > 1048576) {
            return `${(number / 1048576).toFixed(2)}MB`;
        }
    }
    //render uploadlist
    const showUpList = (<>
        {renderfilelist.map(val => {
            return (
                <li key={val.name}><span>{val.name}</span><span>{val.size}</span><div className={classes.resumeDelIcon} onClick={() => clearupload(val.name)}><DeleteIcon /></div></li>)

        })}

    </>)

    // --------------------------------form collect------------------------------

    // const [applydata, setApplyData] = useState({
    //     career_id: props.career_id,
    //     first_name: "",
    //     last_name: "",
    //     email: "",
    //     phone_no: '',
    //     birthday: "",
    //     educations:
    //         [],
    //     experiences:
    //         [],
    //     resume: null,
    // })


    useEffect(() => {
        register(
            { name: 'resume_file' }
        );
        return () => unregister("resume_file"); //
    }, [])

    // TODO 在handlesubmit的狀況下，設定判斷，進行return?
    const handleSubmitCareer = () => {
        console.log(submitRef.current)
        if (submitRef !== null) {
            submitRef.current.click();
        }
    }

    const onSubmit = data => {
        console.log(data);
        if (Object.keys(errors).length !== 0)
            return;

        const applydata = {
            career_id: career_id,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone_no: data.country_code + data.phone_number,
            birthday: data.birth,
        }

        if (data.company[0].name) {
            const formatCompanys = data.company.map(item => {
                const obj = {
                    company_name: item.name,
                    job_title: item.job_title,
                }

                if (item.is_work_here)
                    obj.currently_work = true;

                if (item.job_duration) {
                    obj.exp_start_date = item.job_duration[0];
                    obj.exp_end_date = item.job_duration[1];
                }

                return { ...obj }
            })
            applydata.experiences = formatCompanys;
        }

        if (data.school[0].name) {
            const formatSchools = data.school.map(item => {
                const obj = {
                    school: item.name,
                    degree: item.degree,
                    field_of_study: item.field,
                }

                if (item.edu_duration) {
                    obj.exp_start_date = item.edu_duration[0];
                    obj.exp_end_date = item.edu_duration[1];
                }

                return { ...obj }
            })
            applydata.educations = formatSchools;
        }

        if (data.resume_file)
            applydata.resume = data.resume_file;

        if (data.portfolio)
            applydata.portfolio = data.portfolio;

        if (data.cover_letter)
            applydata.content = data.cover_letter;


        const json = JSON.stringify(applydata);
        const req = new Blob([json], {
            type: 'application/json'
        });
        const formData = new FormData();

        formData.append("req", req);

        setIsLoading(true);
        fetchListener.current = from(postCareerApplyAPI(formData)).subscribe(response => {
            if (response.status === 200) {
                const { header } = response.data;
                if (header.status.toUpperCase() === 'OK') {
                    const { closePopWindowFunc } = popWindowData;
                    const { openDialogFunc, closeDialogFunc } = dialogData;
                    setIsLoading(false);
                    closePopWindowFunc();
                    //上傳完成跳窗//加入翻譯檔
                    openDialogFunc({
                        component: DialogBlock,
                        componentProps: {
                            type: "success",
                            // Submitted
                            title: intl.formatMessage({ id: 'Careers_Submitted' }),
                            // Thank you for apply the position %JobTitle%. We need few days to run the recruit process. We will contact you immediately after the process compeleted.
                            message: `${intl.formatMessage({ id: 'Careers_[content1]Submitted' })}${title}.${intl.formatMessage({ id: 'Careers_[content2]Submitted' })}`,
                            // Close
                            buttons: [
                                <Button
                                    key="dialog_button_confirm"
                                    title={<FormattedMessage id="Careers_Close" />}
                                    type={"button"}
                                    onClick={(e) => { closeDialogFunc(); }}
                                />
                            ]
                        },
                        closeByButtonOnly: true,
                    });
                }
            }
        });
    }

    // console.log(errors);
    return (
        //TODO 跳窗RWD內容跑版處理
        <>
            {/* --------------------------最外層---------------------------- */}
            {/* //跳窗會自動計算顯示高度，所以直接拉props的style即可 */}
            <div className={classes.outWrapper} style={style}>
                {/* --------------------------內容頁------------------- */}
                <div className={classes.innerWrapper}>
                    {/* --------------------------location------------------- */}
                    <div className={classes.location}>
                        <h3>{intl.formatMessage({ id: 'Careers_Location' })}</h3>
                        <span><LoactionIcon color="#f6a800" /></span><p>{props.locationAddress}</p>
                    </div>
                    {/* --------------------------basicInfo------------------- */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={classes.basicInfo}>
                            <h3>{intl.formatMessage({ id: 'Careers_Basic Information' })}<span>{"(" + intl.formatMessage({
                                id: 'Careers_Required'
                            }) + ")"}</span></h3>
                            {/* --------------------basicInfo--------part1-----name-email----- */}

                            < section className={classes.basicPart1} >
                                <Controller
                                    as={<Textfield
                                        customClass={classes.basicInp}
                                        name="first_name"
                                        placeholder={intl.formatMessage({ id: 'Careers_First Name' })}
                                        warning={errors.first_name?.type === 'required' ? '請輸入名' : null || errors.first_name?.type === 'maxLength' ? '超過50字' : null} />}
                                    control={control}
                                    rules={{ required: true, maxLength: 50 }}
                                    name="first_name"
                                />
                                <Controller
                                    as={<Textfield
                                        customClass={classes.basicInp}
                                        name="last_name"
                                        placeholder={intl.formatMessage({ id: 'Careers_Last Name' })}
                                        warning={errors.last_name?.type === 'required' ? '請輸入姓' : null || errors.last_name?.type === 'maxLength' ? '超過50字' : null} />}
                                    control={control}
                                    rules={{ required: true, maxLength: 50 }}
                                    name="last_name"
                                />
                                <Controller
                                    as={<Textfield
                                        customClass={classes.basicInp}
                                        name="email"
                                        placeholder={intl.formatMessage({ id: 'Careers_Email' })}
                                        warning={errors.email?.type === 'required' ? '請輸入電子信箱' : null || errors.email?.type === 'maxLength' ? '超過50字' : null} />}
                                    control={control}
                                    rules={{ required: true, maxLength: 100 }}
                                    name="email"
                                />
                            </section>
                            {/* ---------------------basicInfo--------part2----phone------- */}

                            <section className={classes.basicPart2}>
                                <div className={classes.phoneNum}>
                                    {/* //結合兩欄位值給一個欄位 */}
                                    {/* defaultOption={{ id: "", name: "台灣 +866" }}
                                        isItemsDefault={true} */}
                                    <div className={classes.phNum1}>
                                        {/* <Controller
                                        as={<Dropdown items={PhList} name="country_code" />}
                                        control={control}
                                            rules={{ required: true }}
                                            name="country_code"
                                            defaultValue="0"
                                        /> */}
                                        <span className={classes.countryNumhold}>+</span>
                                        <div className={classes.countryNum1}>
                                            <Controller
                                                as={<Textfield placeholder="886" name="country_code" warning={errors.country_code ? '國碼錯誤' : null} />}
                                                rules={{ required: true, maxLength: 3 }}
                                                control={control}
                                                name="country_code"
                                            />
                                        </div>
                                    </div>

                                    <div className={classes.phNum2} >
                                        <Controller
                                            as={<Textfield placeholder={intl.formatMessage({ id: 'Careers_Phone Number' })} name="phone_number" warning={errors.phone_number ? '請輸入手機號碼' : null} />}
                                            control={control}
                                            rules={{ required: true }}
                                            name="phone_number"
                                        />
                                    </div>
                                </div>
                            </section>
                            {/* ------------------basicInfo--------part3-----birth------ */}

                            <section className={classes.basicPart3}>
                                <h5>{intl.formatMessage({ id: 'Careers_Birthday' })}</h5>
                                {/* 設計上e等於value等於moment */}
                                <Controller
                                    as={<CalendarDatePicker name="birth" customClass={classes.antRWD} theme='light' showInPopup={true} />}
                                    control={control}
                                    rules={{ required: true }}
                                    name="birth"
                                    defaultValue=""
                                />
                                {errors.birth && <span>請輸入生日</span>}
                                {/* <CalendarDatePicker name="birth" value={applydata.birthday} onChange={e => handleChanegBirth(e)} /> */}
                            </section>
                        </div>
                        {/* --------------------------curriculum------------------- */}
                        <div className={classes.curriculum}>
                            <h3>{intl.formatMessage({ id: 'Careers_Curriculum Vitae' })}</h3>
                            <h5>{intl.formatMessage({ id: 'Careers_Education' })}</h5>
                            {/* --------------------------education------------------- */}

                            <div className={classes.education}>
                                {/* --------------------------education--U1----------------- */}
                                {(() => {
                                    const returnArr = [];
                                    for (let i = 0; i < 2; i++) {
                                        returnArr.push(
                                            <Fragment key={`school_${i}`}>
                                                <ul className={classes.educationUnit}>
                                                    <li>
                                                        <Controller
                                                            as={<Textfield
                                                                placeholder={intl.formatMessage({ id: 'Careers_School' })}
                                                                name={`school[${i}].name`}
                                                                warning={errors?.school && errors?.school[i].name?.type === 'maxLength' ? '超過100字' : null}
                                                            />}
                                                            control={control}
                                                            rules={{ maxLength: 100 }}
                                                            name={`school[${i}].name`}
                                                        />
                                                    </li>
                                                    <li>
                                                        <Controller
                                                            as={<Dropdown
                                                                customClass={classes.DegreeDrop}
                                                                items={EducationList}
                                                                name={`school[${i}].degree`}
                                                                theme="light"
                                                            />}
                                                            control={control}
                                                            rules={register}
                                                            onChange={([selected]) => {
                                                                return selected;
                                                            }}
                                                            name={`school[${i}].degree`}
                                                            defaultValue="研究所"
                                                        />
                                                    </li>
                                                    <li>
                                                        <Controller
                                                            as={<Textfield name={`school[${i}].field`}
                                                                placeholder={intl.formatMessage({ id: 'Careers_Field of study' })}
                                                                warning={errors?.school && errors?.school[i]?.field?.type === 'maxLength' ? '超過100字' : null}
                                                            />}
                                                            control={control}
                                                            rules={{ maxLength: 100 }}
                                                            name={`school[${i}].field`}
                                                        />
                                                    </li>
                                                    <li>
                                                        <ul>
                                                            <Controller
                                                                as={<RangePicker theme='light' customClass={classes.antRWD} picker="month" showInPopup={true} />}
                                                                control={control}
                                                                rules={register}
                                                                onChange={([selected]) => {
                                                                    if (selected)
                                                                        return [moment(selected[0]).format('YYYY/MM'), moment(selected[1]).format('YYYY/MM')];
                                                                }}
                                                                name={`school[${i}].edu_duration`}
                                                            />
                                                        </ul>
                                                    </li>
                                                </ul>
                                                {i < 2 && <div className={classes.seperateLine}></div>}
                                            </Fragment>
                                        );
                                    }
                                    return returnArr;
                                })()}
                            </div>
                            {/* ---------------------------------experience----------------          */}
                            <div className={classes.experience}>
                                <h5>{intl.formatMessage({ id: 'Careers_Experience' })}</h5>
                                {/* -------------------------experience---U1-------------*/}
                                {(() => {
                                    const returnArr = [];
                                    for (let i = 0; i < 2; i++) {
                                        returnArr.push(
                                            <Fragment key={`school_${i}`}>
                                                <ul className={classes.experienceUnit}>
                                                    <li>
                                                        <Controller
                                                            as={<Textfield
                                                                placeholder={intl.formatMessage({ id: 'Careers_Company Name' })}
                                                                name={`company[${i}].name`}
                                                                warning={errors?.company && errors?.company[i]?.name?.type === 'maxLength' ? '超過100字' : null}
                                                            />}
                                                            control={control}
                                                            rules={{ maxLength: 100 }}
                                                            name={`company[${i}].name`}
                                                        />
                                                    </li>
                                                    <li>
                                                        <Controller
                                                            as={<Textfield
                                                                placeholder={intl.formatMessage({ id: 'Careers_Job Title' })}
                                                                name={`company[${i}].job_title`}
                                                                warning={errors?.company && errors?.company[i]?.job_title?.type === 'maxLength' ? '超過100字' : null}
                                                            />}
                                                            control={control}
                                                            rules={{ maxLength: 100 }}
                                                            name={`company[${i}].job_title`}
                                                        />
                                                    </li>
                                                    <li>
                                                        <ul>
                                                            <Controller
                                                                as={<RangePicker theme="light" customClass={classes.antRWD} picker="month" showInPopup={true} />}
                                                                control={control}
                                                                rules={register}
                                                                onChange={([selected]) => {
                                                                    if (selected)
                                                                        return [moment(selected[0]).format('YYYY/MM'), moment(selected[1]).format('YYYY/MM')];
                                                                }}
                                                                name={`company[${i}].job_duration`}
                                                            />
                                                        </ul>
                                                    </li>
                                                    {i === 0 &&
                                                        <li>
                                                            <Controller
                                                                as={<Checkbox title={intl.formatMessage({ id: 'Careers_I currently work here' })} />}
                                                                control={control}
                                                                rules={register}
                                                                type="checkbox"
                                                                theme="light"
                                                                onChange={(e) => {
                                                                    return !watch(`company[${i}].is_work_here`);
                                                                }}
                                                                name={`company[${i}].is_work_here`}
                                                                defaultValue={false}
                                                            />
                                                        </li>
                                                    }
                                                </ul>
                                                <div className={classes.seperateLine}></div>
                                            </Fragment>
                                        )
                                    }
                                    return returnArr;
                                })()}
                            </div>
                            {/* ---------------------------------resume----------------          */}
                            <div className={classes.resume}>
                                <ul className={classes.resumeUnit}>
                                    {/* Uploaddisplay */}
                                    {/* {uploaded && Uploaddisplay} */}
                                    {/* <span >{uploadfilename}<div className={classes.resumeDelIcon}><DeleteIcon /></div></span> */}
                                    {/* <li><h5>Resume: <div style={{ display: `${uploaded ? "inline-block" : "none"}` }}><span>{`${uploadfilename} \(${filesize}\)`}<div className={classes.resumeDelIcon} onClick={clearupload}><DeleteIcon /></div></span></div></h5> */}
                                    <li><h5>{intl.formatMessage({ id: 'Careers_Resume' }) + ":"}</h5>
                                        <ul className={classes.upfilelist}>
                                            {showUpList}
                                        </ul>
                                        {/* file input */}
                                        {/* <div className={classes.resumebtn} style={{ display: `${uploaded ? "none" : "inline-block"}` }}> */}
                                        <div className={classes.resumebtn} style={{ display: `${continueupload ? "inline-block" : "none"}` }}>
                                            <input
                                                type="file"
                                                id="resumeFiles"
                                                accept=".doc,.docx,.ppt,.pdf,image/*"
                                                name="resume_file"
                                                multiple="multiple"
                                                onChange={handleResumeUpload}
                                                style={{ display: 'none' }}
                                                ref={uploadResumeRef}
                                            />
                                            <Button title={intl.formatMessage({ id: 'Careers_[btn]Upload' })} size="sm_1" onClick={fakeactive} />
                                        </div>
                                    </li>
                                    <li><span className={classes.uploadfilewaring}>{intl.formatMessage({ id: 'Careers_upload_warning' })}</span></li>
                                    <li>
                                        <Controller
                                            as={<Textfield
                                                placeholder={intl.formatMessage({ id: 'Careers_Portfolio Web' })}
                                                warning={errors.portfolio?.type === 'maxLength' ? '超過100字' : null}
                                            />}
                                            control={control}
                                            rules={{ maxLength: 100 }}
                                            name="portfolio"
                                        />
                                    </li>
                                    <li>
                                        <div className={classes.resumeTextarea}>
                                            <Controller
                                                as={<Textarea
                                                    placeholder={intl.formatMessage({ id: 'Careers_Cover Letter' })}
                                                    warning={errors.cover_letter?.type === 'maxLength' ? '超過500字' : null}
                                                />}
                                                control={control}
                                                rules={{ maxLength: 500 }}
                                                name="cover_letter"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div className={classes.checkarea}>
                                            <Controller
                                                as={<Checkbox title={<FormattedMessage id={'Careers_I agree to the {privacy_policy}'}
                                                    values={{
                                                        privacy_policy:
                                                            //引導到隱私頁
                                                            <Link to={{ pathname: `${configData.pathPrefix}/policy/privacy-policy` }} target="_blank">
                                                                {intl.formatMessage({ id: 'Careers_Privacy Policy' })}
                                                            </Link>
                                                    }} >
                                                </FormattedMessage>} />
                                                }
                                                control={control}
                                                rules={{ required: true }}
                                                type="checkbox"
                                                theme="light"
                                                onChange={(e) => {
                                                    return !watch('is_agree_policy');
                                                }}
                                                name="is_agree_policy"
                                                defaultValue={false}
                                            />
                                        </div>
                                        {/* <Link to="">Privacy Policy</Link> */}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* <input type="submit" /> */}
                        <button className="button" style={{ display: 'none' }} ref={submitRef}>111</button>
                    </form>
                </div>
                {/* ---------------------------------submitbtn----------------          */}
                <div className={classes.subbtn}><Button title={intl.formatMessage({ id: 'Careers_[btn]Submit' })} disabled={!isValid} isLoading={isLoading} onClick={handleSubmitCareer} /></div>
            </div>
        </>
    )
}

export default injectIntl(
    withRouter(
        withConfigConsumer(
            withPopWindowConsumer(
                withDialogConsumer(ApplyCareer)
            )
        )
    )
);