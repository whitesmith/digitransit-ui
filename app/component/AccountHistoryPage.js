import PropTypes from 'prop-types';
import React from 'react';
import { routerShape } from 'react-router';
import Icon from './Icon';
import { FormattedMessage } from 'react-intl';
import withBreakpoint from '../util/withBreakpoint';
import DeparturesTable from './DeparturesTable';
import Stat from './Stat';
import RecentSearchRow from './RecentSearchRow';
import CaloriesIcon from 'material-ui/svg-icons/social/whatshot';
import Loading from './Loading';
import { withAuthentication } from './session';
import { PAGE_MODE_FIRST, PAGE_MODE_NEXT, PAGE_MODE_PREVIOUS } from './firebase/Firebase'

const resetIconStyle = { display: '', color: '', fill: '', height: '', width: '', userSelect: '', transition: '' };

const baseStats = {
  co2: null,
  publicTransportation: null,
  walkDistance: null,
  calories: null,
};

class AccountHistoryPage extends React.Component {
  static contextTypes = {
    router: routerShape.isRequired,
    config: PropTypes.object.isRequired,
  };

  static propTypes = {
    breakpoint: PropTypes.string.isRequired,
  };
  
  constructor(props) {
    super(props);
    this.state = {
      recentSearches: [],
      loading: false,
      statsLoading: false,
      userAverages: baseStats,
      globalAverages: baseStats
    };
  }

  getSearchHistory = mode => {
    this.setState({ loading: true });
    this.props.firebase.getUserSearchHistory(mode).then(snap => {
      const results = [];

      snap.forEach(s => {
        const search = s.val();
        const { legs } = search.itinerary;
        if (legs && legs.length > 0) {
          const distanceComparator = (a, b) => b.distance - a.distance;
          // get transit legs ordered by distance
          const orderedTransitLegs = legs
            .filter(leg => leg.transitLeg)
            .sort(distanceComparator);

          results.unshift({
            ...search,
            duration: legs.reduce((acc, leg) => acc + leg.duration, 0),
            from: search.from.address,
            to: search.to.address,
            // use biggest transit leg route or a custom walk/bike route otherwise
            via:
              orderedTransitLegs.length === 0
                ? legs.sort(distanceComparator)
                : orderedTransitLegs.map(l => l.route),
          });
        }
      });
      this.setState({ recentSearches: results, loading: false });
    });
  }

  componentDidUpdate(prevProps) {
    const { authUser, firebase } = this.props;
    if (authUser !== prevProps.authUser && authUser) {
      this.getSearchHistory(PAGE_MODE_FIRST);
      this.setState({ statsLoading: true })
      firebase.getAverages().then(res => {
        this.setState({ 
          userAverages: res[0].val() ? res[0].val() : baseStats,
          globalAverages: res[1].val() ? res[1].val() : baseStats,
          statsLoading: false,
        })
      })
    }
  }

  calcPercentageDiff = (userAvg, refAvg) => Math.round((userAvg * 100) / refAvg) - 100;
  
  render() {
    const { breakpoint, firebase } = this.props;
    const { recentSearches, loading, statsLoading, userAverages, globalAverages} = this.state;
    const desktop = breakpoint === 'large';

    return (
      <div className={`flex-vertical fullscreen bp-${breakpoint}`}>
        <div className="account-history-container">
          {/* start usage metrics section */}
          <div className="page-frame fullscreen fullwidth">
            <h2 className="account-heading">
              <Icon
                className="prefix-icon icon--heading"
                img="icon-icon_route"
              />
              <FormattedMessage
                id="usage-metrics"
                defaultMessage="Usage metrics"
              />
            </h2>
            {statsLoading ? ( <div className="padding-vertical-normal"><Loading /></div> ) : (
              <div className="stats-container">
                <div className="stat">
                  <Stat
                    icon="car-withoutBox"
                    textId={'car-emissions'}
                    defaultMessage={'Car emissions'}
                    amount={userAverages.co2}
                    unit={
                      <>
                        kgCO<sub>2</sub>
                      </>
                    }
                    percentage={this.calcPercentageDiff(userAverages.co2, globalAverages.co2)}
                    inverted={true}
                  />
                </div>
                <div className="stat">
                  <Stat
                    icon="public_transport"
                    textId={'public-transport'}
                    defaultMessage={'Public transport'}
                    amount={userAverages.publicTransportation}
                    unit="km"
                    percentage={this.calcPercentageDiff(userAverages.publicTransportation, globalAverages.publicTransportation)}
                  />
                </div>
                <div className="stat">
                  <Stat
                    icon="walk"
                    textId={'walking-distance'}
                    defaultMessage={'Walking distance'}
                    amount={userAverages.walkDistance}
                    unit="km"
                    percentage={this.calcPercentageDiff(userAverages.walkDistance, globalAverages.walkDistance)}
                  />
                </div>
                <div className="stat">
                  <Stat
                    icon={(
                      <span aria-hidden="true" className="icon-container">
                        <CaloriesIcon className="icon prefix-icon stat__icon" style={resetIconStyle} />
                      </span>
                    )}
                    textId={"calories-walked"}
                    defaultMessage={"Calories walked"}
                    amount={userAverages.calories}
                    unit="kcal"
                    percentage={this.calcPercentageDiff(userAverages.calories, globalAverages.calories)}
                  />
                </div>
              </div>
            )}
          </div>
          {/* end usage metrics section */}
        </div>
        <div className={desktop ? 'fpccontainer' : 'parent'}>
          <div
            className={`no-select ${
              desktop ? 'fpcfloat' : 'frontpage-panel-container'
            }`}
          >
            <ul
              className={`tabs-row cursor-pointer ${desktop ? 'bp-large' : ''}`}
            >
              <li
                className={`h4 selected ${desktop ? 'bp-large' : 'hover'}`}
                role="button"
              >
                <div className="row text-left padding-horizontal">
                  <Icon
                    className="prefix-icon recent-icon"
                    img="icon-icon_schedule"
                  />
                  <FormattedMessage
                    id="recent-searches"
                    defaultMessage="Recent searches"
                  />
                </div>
              </li>
            </ul>
            <div
              className={`fullscreen recent-searches-table-container ${
                desktop ? 'frontpage-panel' : ''
              }`}
            >
              {/* start recent searches section */}
              {loading ? (
                <Loading />
              ) : (
                  <div>
                    <DeparturesTable
                      headers={[
                        { id: 'origin', defaultMessage: 'Origin' },
                        { id: 'destination', defaultMessage: 'Destination' },
                        { id: 'via', defaultMessage: 'Via' },
                        { id: 'duration', defaultMessage: 'Duration' },
                        { id: 'walk', defaultMessage: 'Walking' },
                        { id: 'empty-actions', defaultMessage: ' ' },
                      ]}
                      content={recentSearches.map(s => (
                        <RecentSearchRow search={s} key={s.searchId} deleteCallback={() =>
                          firebase.deleteUserSearch(s.searchId)
                            .then(() => this.getSearchHistory(PAGE_MODE_FIRST))
                        } />
                      ))}
                    />

                    <div className="recent-searches__pagination">
                    
                    {firebase && firebase.prevQueryCursor &&
                      <button
                        className="pagination-button noborder"
                        onClick={() => this.getSearchHistory(PAGE_MODE_PREVIOUS)}
                      >
                        <Icon img="icon-icon_arrow-left" className="back cursor-pointer" />
                      </button>
                    }

                    {firebase && firebase.nextQueryCursor &&
                      <button
                        className="pagination-button noborder"
                        onClick={() => this.getSearchHistory(PAGE_MODE_NEXT)}
                      >
                        <Icon img="icon-icon_arrow-right" className="back cursor-pointer"/>
                      </button>
                    }

                    </div>

                  </div>

                )}

              {/* end recent searches section */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withAuthentication(withBreakpoint(AccountHistoryPage));
