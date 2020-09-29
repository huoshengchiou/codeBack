import React from 'react';
import { withConfigConsumer } from "contexts/Config";
import { withAuthConsumer } from "contexts/Auth";
import { withDialogConsumer } from "components/layouts/Dialog/Context";
import { withPopWindowConsumer } from "components/layouts/PopWindow/Context";
//translate
import { injectIntl } from 'react-intl';
//router material
import { withRouter } from "react-router-dom";
//CSS
import classes from './style.module.scss';
//import component
import RankList from '../../Standings/Basic/RankList';
//api
import { useFetchStanding } from '../../../hooks/useFetchStanding';
//load 
import Loading from 'components/utils/Loading';
//top bar
import EbTopBar from '../EbTopBar'
import Base from './Base'
import FreeForAll from './FreeForAll'


// const Standing = ({ match, intl }) => {

//   const { t8t_serial } = match.params

//   // // fetch standing data
//   const { Ranklist, IsFetchFin, IsGame1v1 } = useFetchStanding({ t8t_serial });

//   return (
//     <>
//       <EbTopBar />
//       {IsFetchFin ? (<RankList rank={Ranklist} isIndividual={IsGame1v1} AdjustForEmbed={true} intl={intl} />) : (<Loading theme='dark' />)}

//     </>
//   )
// }

// export default withRouter(withPopWindowConsumer(
//   withConfigConsumer(withAuthConsumer(withDialogConsumer(injectIntl(Standing))))))



const EmbedStanding = ({ authData, match, history, location }) => {
  const { apiWithTokenWrapper, isLoggedIn } = authData
  //get type from URL
  const { type } = match.params

  //   const [MatchData, setMatchData] = useState([])
  //   const [IsFetchFin, setIsFetchFin] = useState(true)

  //   const fetchListener = useRef(null)



  //   useEffect(() => {
  //     return () => {
  //       //取消fetch監聽
  //       if (fetchListener.current) fetchListener.current.unsubscribe();
  //     };

  //   }, [])

  const getComponent = (type) => {
    switch (type) {
      case "ffa":
        return <FreeForAll t8t={1} />
      default:
        return <Base />
    }

  }

  return (<>
    <EbTopBar />
    <>
      {getComponent(type)}
    </>
  </>)
}

export default withRouter(withPopWindowConsumer(
  withConfigConsumer(withAuthConsumer(withDialogConsumer(injectIntl(EmbedStanding))))))
