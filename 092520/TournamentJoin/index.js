import React, { useState, useEffect } from "react";
//child component
import TJ_single_wrapper from './TJ_single_wrapper'
import TJ_team_wrapper from './TJ_team_wrapper'
//layout
import TemplateV2 from 'components/layouts/TemplateV2';
//global info
import { withAuthConsumer } from 'contexts/Auth';
import { withConfigConsumer } from 'contexts/Config';
//translate
import { injectIntl } from 'react-intl';
//router
import { withRouter } from "react-router-dom";
//fetch hook
import { useGetgamedetail } from './useTJ_gamedetail_fetch'

//取得loading圖示component
import Loading from 'components/utils/Loading';


// -----------------CSS associated------------------------
import classes from './style.module.scss';
import classNames from 'classnames/bind';

import BarContainer from 'components/pages/Tournament/components/BarContainer'
import Bar from './Bar';
import HeaderBar from "components/pages/Tournament/components/HeaderBar"


// const RegistrationFinished = ({ }) => {
//   return (
//     <div className={classes.registrationFinishedBox}>
//       <div className={cx('messageBox')}>
//         <div className={cx('messageCol')}>
//           <div className={cx('imgBlock')}>
//             {/* <img src={require('./imgs/img_logo.png')} alt="" /> */}
//           </div>
//           <div className={cx('logoBlock')}>
//             <img src={require('./imgs/img_logo.png')} alt="" />
//             <p>Planet9 League</p>
//           </div>
//         </div>
//         <div className={cx('messageCol')}>
//           <h5>Organizer</h5>
//           <p>ClubName</p>
//         </div>
//         <div className={cx('messageCol')}>
//           <h5>Organizer</h5>
//           <p>ClubName</p>
//         </div>
//       </div>
//       <Button title="Browse Other Battles" customClass={classes.finishBtn} />
//     </div>
//   )
// }

// const Confirmation = ({ }) => {
//   return (
//     <div className={classes.formWrapper}>
//       <div className={cx('infoTitle')}>
//         Confirmation
//       </div>
//       <div className={cx('infoInner')}>
//         <div className={cx('col')}>
//           <h4>Applier</h4>
//           <div className={cx('user')}>
//             <img src={require('./imgs/img_user.png')} alt="" />
//             <p>%UserName%</p>
//           </div>
//         </div>
//         <div className={cx('col')}>
//           <h4>Team</h4>
//           <p className={cx('status')}>%TeamName%</p>
//         </div>
//         <div className={cx('col')}>
//           <h4>Team</h4>
//           <div className={cx('user')}>
//             <img src={require('./imgs/img_user.png')} alt="" />
//             <img src={require('./imgs/img_user.png')} alt="" />
//             <img src={require('./imgs/img_user.png')} alt="" />
//             <img src={require('./imgs/img_user.png')} alt="" />
//             <img src={require('./imgs/img_user.png')} alt="" />
//             <img src={require('./imgs/img_user.png')} alt="" />
//             <img src={require('./imgs/img_user.png')} alt="" />
//           </div>
//         </div>
//         <div className={cx('col')}>
//           <h4>Format</h4>
//           <div className={cx('content')}>
//             <div className={cx("clubIco", "global")}>
//               <img src={require('./imgs/ico_global.png')} alt="" />
//               <p>Global | Bracket</p>
//             </div>
//             <div className={cx("clubIco", "lvl")}>
//               <img src={require('./imgs/ico_lvl.png')} alt="" />
//               <p>1v1- Single Elimination</p>
//             </div>
//             <div className={cx("clubIco", "schedule")}>
//               <img src={require('./imgs/ico_schedule.png')} alt="" />
//               <p>[Start] 2020.04.01 | 24:00 CST</p>
//             </div>
//           </div>
//         </div>
//         <div className={cx('col')}>
//           <h4>Ticket</h4>
//           <p className={cx('status')}>Free</p>
//         </div>
//       </div>
//     </div>
//   )
// }

// const AddStarter = ({ }) => {
//   const [isChecked, setIsChecked] = useState(false);
//   const addUser = [
//     {
//       name: '%TeamName%',
//       gameId: '1768391697',
//       status: '%Val%%',
//     },
//     {
//       name: '%TeamName%',
//       gameId: '1768391697',
//       status: '%Val%%',
//     },
//     {
//       name: '%TeamName%',
//       gameId: '1768391697',
//       status: '%Val%%',
//     },
//     {
//       name: '%TeamName%',
//       gameId: '1768391697',
//       status: '%Val%%',
//     },
//     {
//       name: '%TeamName%',
//       gameId: '1768391697',
//       status: '%Val%%',
//     },
//     {
//       name: '%TeamName%',
//       gameId: '1768391697',
//       status: '%Val%%',
//     },
//     {
//       name: '%TeamName%',
//       gameId: '1768391697',
//       status: '%Val%%',
//     },
//   ]

//   return (
//     <div className={classes.addStarterBox}>
//       <p>Required</p>
//       <p className={cx('requiredNumber')}>0 / 5</p>
//       <div>
//         <table className={cx('addUserTable')}>
//           <thead>
//             <tr>
//               <th></th>
//               <th>User Name</th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {addUser.map((item) => (
//               <tr>
//                 <td>
//                   <Checkbox
//                     title=''
//                     checked={isChecked}
//                     onChange={() => setIsChecked(!isChecked)}
//                   />
//                 </td>
//                 <td className={classes.userName}>
//                   <img src={require('./imgs/img_user.png')} alt="" />
//                   <div className={classes.userInfo}>
//                     <h5>{item.name}</h5>
//                     <p className={classes.gameID}>{item.gameId}</p>
//                   </div>
//                 </td>
//                 <td>{item.status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <Button title="Add" customClass={classes.addBtn} />
//     </div>
//   )
// }

// const TournamentPending = ({ }) => {
//   return (
//     <div className={classes.tournamePendingBox}>
//       <div className={cx('messageBox')}>
//         <p>You haven’t finished the registration flow. Registration will close on</p>
//         <div className={cx('messageCol')}>
//           <h5>2019/9/16 9:00AM~10:00AM | Asia/Taipei(+8)</h5>
//         </div>
//         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et</p>
//       </div>
//       <Button title="Confirm" customClass={classes.confirmBtn} />
//     </div>
//   )
// }

// const JoinCodeAndRequireData = ({ }) => {
//   const requireUser = [
//     {
//       name: '%TeamName%',
//       gameId: '1768391697',
//       status: '%Val%%',
//     },
//     {
//       name: '%TeamName%',
//       gameId: '1768391697',
//       status: '%Val%%',
//     },
//     {
//       name: '%TeamName%',
//       gameId: '1768391697',
//       status: '%Val%%',
//     },
//     {
//       name: '%TeamName%',
//       gameId: '1768391697',
//       status: '%Val%%',
//     },
//   ]

//   return (
//     <div className={classes.formWrapper}>
//       <div className={cx('infoTitle')}>
//         Required Data
//       </div>
//       <div className={cx('infoInner', 'joinInput')}>
//         <Textfield title="%Required Title%" value="%Val%" />
//       </div>
//       <div className={cx('infoTitle')}>
//         Required Data
//       </div>
//       <div className={cx('infoInner', 'joinInput')}>
//         <p>Lorem ipsum dolor sit amet, co nsect etur adipi scing elit. Aenean L</p>
//         <table className={cx('requireUserTable')}>
//           <thead>
//             <tr>
//               <th>User Name</th>
//               <th>%Required Title%</th>
//             </tr>
//           </thead>
//           <tbody>
//             {requireUser.map((item) => (
//               <tr>
//                 <td className={classes.userName}>
//                   <img src={require('./imgs/img_user.png')} alt="" />
//                   <div className={classes.userInfo}>
//                     <h5>{item.name}</h5>
//                     <p className={classes.gameID}>{item.gameId}</p>
//                   </div>
//                 </td>
//                 <td className={cx('requiredInput')}>
//                   <Textfield />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

// const SelectTeam = ({ popWindowData }) => {
//   const [value, setValue] = useState(null);

//   const items = [
//     {
//       id: 0,
//       key: 0,
//       name: 'dropdown1',
//     },
//     {
//       id: 1,
//       key: 1,
//       name: 'dropdown2',
//     },
//   ];

//   const addStarter = [
//     {
//       name: '%UserNameaaaaaaaeewdwed',
//       gameId: 'GameID',
//     },
//     {
//       name: '%UserNameaaaaaaaeewdwed',
//       gameId: 'GameID',
//     },
//     {
//       name: '%UserName',
//       gameId: 'GameID',
//     },
//     {
//       name: '%UserNameaaaaaaaeewqwdqwdqwdwdwed',
//       gameId: 'GameID',
//     },
//     {
//       name: '%UserNamea212edwed',
//       gameId: 'GameID',
//     }
//   ]
//   const addBench = [1, 2, 3, 4, 5]

//   return (
//     <div className={classes.formWrapper}>
//       <div className={cx('infoTitle')}>
//         Select Your Team
//       </div>
//       <div className={cx('infoInner')}>
//         <Dropdown
//           items={items}
//           name="dropdown"
//           id="dropdown"
//           value={value}
//           defaultOption={{ id: "", name: "UserName" }}
//           isItemsDefault={true}
//           onChange={(e) => {
//             setValue(e.target.selectedIndex - 1)
//             console.log(e.target.selectedIndex);
//           }}
//         />
//         <img src={require('./imgs/img_user.png')} alt="" className={cx('userImg')} />
//       </div>
//       <div className={cx('infoTitle')}>
//         Confirmation
//       </div>
//       <div className={cx('infoInner', 'cardBottom')}>
//         <div className={cx('col')}>
//           <p className={cx('content')}>Lorem ipsum dolor sit amet, co nsect etur adipi scing elit. Aenean Lore gjhgfm ipsu m dolo r sit adsmet, cons ecte tur adipi scing elit , sed do  eius  mod tempor inc ididunt ut labo re et don lore magna aliqua. Quis ipsum suspendisse ult rices gravida. Risus coodo vivera maecnas.</p>
//         </div>
//         <div className={cx('col')}>
//           <h4>Add Starter</h4>
//           <p className={cx('status')}>5 / 5</p>
//           <div className={cx('addStarterGroup')}>
//             {addStarter.map((item) => (
//               // Class Status: .addNewUser and .disableCard
//               <div className={cx('addStarterCard')}>
//                 <div className={cx('gap')}>
//                   <div className={classes.column}>
//                     <img src={require('./imgs/img_user.png')} alt="" />
//                     <div className={classes.userInfo}>
//                       <h5>{item.name}</h5>
//                       <p>{item.gameId}</p>
//                       <img src={require('./imgs/ico_add.svg')} alt="" />
//                     </div>
//                     <div className={classes.tools}>
//                       <img src={require('./imgs/ico_trash.svg')} alt="" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className={cx('col')}>
//           <h4>Add Bench Player (Optional)</h4>
//           <p className={cx('status')}>0 / 5</p>
//           <div className={cx('addStarterGroup', 'addNewGroup')}>
//             {addBench.map((item) => (
//               <div className={cx('addStarterCard', 'addNewUser')}>
//                 <div className={cx('gap')}>
//                   <div className={classes.column}>
//                     <img src={require('./imgs/img_user.png')} alt="" />
//                     <div className={classes.userInfo}>
//                       <h5>{item.name}</h5>
//                       <p>{item.gameId}</p>
//                       <img src={require('./imgs/ico_add.svg')} alt="" />
//                     </div>
//                     <div className={classes.tools}>
//                       <img src={require('./imgs/ico_trash.svg')} alt="" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//       <Button title="Add Starter" onClick={() => {
//         const { openPopWindowFunc } = popWindowData;
//         const popWindowAttributes = {
//           component: AddStarter,
//           componentProps: {
//             title: 'Add Starter',
//           },
//           closeByButtonOnly: true,
//           isFullModeForMobile: false,
//         };
//         openPopWindowFunc(popWindowAttributes);
//       }} />
//     </div>
//   )
// }

// const NoJoinTeam = ({ popWindowData }) => {
//   return (
//     <div className={classes.formWrapper}>
//       <div className={cx('infoTitle')}>
//         Select Your Team
//       </div>
//       <div className={cx('infoInner')}>
//         <p className={cx('title')}>You have not joined any teams yet</p>
//         <p>
//           you can pending this tournament first, <br />
//           explore other teams to join, <br />
//           or create your own team!
//         </p>
//       </div>
//       <Button title="Do it later" onClick={() => {
//         const { openPopWindowFunc } = popWindowData;
//         const popWindowAttributes = {
//           component: TournamentPending,
//           componentProps: {
//             title: 'Tournament Pending',
//           },
//           closeByButtonOnly: true,
//           isFullModeForMobile: false,
//         };
//         openPopWindowFunc(popWindowAttributes);
//       }} />
//     </div>
//   )
// }

// const ＡpplyPolicy = ({ }) => {
//   const [isChecked, setIsChecked] = useState(false);

//   return (
//     <div className={classes.formWrapper}>
//       <div className={cx('infoTitle')}>
//         Format
//       </div>
//       <div className={cx('infoInner')}>
//         <div className={cx("clubIco", "global")}>
//           <img src={require('./imgs/ico_global.png')} alt="" />
//           <p>Global | Bracket</p>
//         </div>
//         <div className={cx("clubIco", "lvl")}>
//           <img src={require('./imgs/ico_lvl.png')} alt="" />
//           <p>1v1- Single Elimination</p>
//         </div>
//         <div className={cx("clubIco", "schedule")}>
//           <img src={require('./imgs/ico_schedule.png')} alt="" />
//           <p>[Start] 2020.04.01 | 24:00 CST</p>
//         </div>
//       </div>
//       <div className={cx('infoTitle')}>
//         Ticket
//       </div>
//       <div className={cx('infoInner')}>
//         <p className={cx('value')}>%Val%</p>
//         <p className={cx('message')}>Warning message!</p>
//       </div>
//       <div className={cx('infoTitle')}>
//         Ticket
//       </div>
//       <div className={cx('infoInner')}>
//         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viv kerra justo c o mm odo. Proin sodales pulvi nar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulput ate, feldis tel lus m ollis orc i, sed rho ncus sap ien nunc eget odio.</p>
//         <div className={cx('agreement')}>
//           <Checkbox
//             title=''
//             checked={isChecked}
//             onChange={() => setIsChecked(!isChecked)}
//             customClass={classes.checkAgreement}
//           />
//           <p>
//             I agree the Tournament Rule,
//             <a href=""> Term of Use </a>
//             and
//             <a href=""> Privacy Policy.</a>
//           </p>
//         </div>
//       </div>

//     </div>
//   )
// }

// --------------------------------------------------main woring area------------------------------


// 1v1 TvT join 分別獨立在不同的Wrapper下處理，各自擁有獨立context




// TODO
//TODO從最外層component拿userData送到page頁
const TournamentJoin = ({ match, intl, location, history, authData, configData }) => {
  const { apiWithTokenWrapper } = authData


  //capture serial from URL
  const [t8t_serial, setT8T_Serial] = useState(match.params.t8t_serial)

  //TODO update gamedetail hook
  const { gamedetail, IsIniFetchOK, IsUserInCb } = useGetgamedetail({ t8t_serial, apiWithTokenWrapper })

  //hold game detail transfer props
  const [currentgamedata, setCurrentGameData] = useState({})


  //TODOno login redirect 
  if (authData.getMemberId() === null) {
    // 沒有登入時導回single頁面
    history.replace({
      ...location,
      pathname: `${configData.pathPrefix}/tournament/list/${t8t_serial}/home`,
    });
  }

  //當fetch結果改變時換state，把資料用props往下傳
  useEffect(() => {
    //TODO當沒有verifiedId 還有in club導回前頁
    if (!gamedetail) return




    //當tournament需要驗遊戲Id且Id未驗證
    if ((gamedetail.is_need_in_game_id_verified) && (!gamedetail.myself.is_in_game_id_verified)) {
      return history.replace({
        ...location,
        pathname: `${configData.pathPrefix}/tournament/list/${t8t_serial}/home`,
      });
    }

    //當rule不為public時不具有Cb身分時
    if ((gamedetail.open_rule !== 'public') && (!IsUserInCb)) {
      return history.replace({
        ...location,
        pathname: `${configData.pathPrefix}/tournament/list/${t8t_serial}/home`,
      });
    }

    setCurrentGameData(gamedetail)

  }, [gamedetail])

  return (
    <>
      <BarContainer topBar={Bar} data={gamedetail}></BarContainer>
      <TemplateV2>
        <div className={classes.box}>
          {/* 1v1 and TvT have individual fetch and context in their wrapper */}
          {IsIniFetchOK ? (<>
            <div className={classes.banner}>
              <HeaderBar detail={gamedetail}></HeaderBar>
            </div>
            <div className={classes.formContainer}>
              {intl.formatMessage({ id: 'TournamentJoin_Join' })}
              {currentgamedata.tournament_format === '1v1' && <TJ_single_wrapper currentgamedata={currentgamedata} />}
              {currentgamedata.tournament_format === 'TvT' && <TJ_team_wrapper currentgamedata={currentgamedata} />}
            </div>
          </>) : (<Loading theme="dark" />)
          }
        </div>
      </TemplateV2>
    </>
  )
}

export default withRouter(injectIntl(withAuthConsumer(withConfigConsumer(TournamentJoin))))