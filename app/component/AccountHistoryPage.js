import PropTypes from 'prop-types';
import React from 'react';
import { routerShape } from 'react-router';
import Icon from './Icon';
import { FormattedMessage } from 'react-intl';
import withBreakpoint from '../util/withBreakpoint';
import DeparturesTable from './DeparturesTable';
import Stat from './Stat';
import RecentSearchRow from './RecentSearchRow';

class AccountHistoryPage extends React.Component {
  static contextTypes = {
    router: routerShape.isRequired,
    config: PropTypes.object.isRequired,
  };

  static propTypes = {
    breakpoint: PropTypes.string.isRequired,
  };

  render() {
    const { config, router } = this.context;
    const { breakpoint } = this.props;
    const desktop = breakpoint === 'large';
    const recentSearches = [
      {
        __dataID__: 1,
        from: 'Aliados',
        to: 'Hosp. S. João',
        via: {
          color: "187EC2",
          gtfsId: "1:301",
          longName: "Hosp. S. João",
          mode: "TRAM",
          shortName: "301"
        },
        duration: 1020,
        walkingDistance: 500
      },
      {
        __dataID__: 2,
        from: 'Santa Catarina',
        to: 'S. Pedro da Costódia',
        via: {
          color: "A250FB",
          gtfsId: "1:801",
          longName: "Santa Catarina",
          mode: "BUS",
          shortName: "801"
        },
        duration: 1920,
        walkingDistance: 260
      },
      {
        __dataID__: 3,
        from: 'Avenida dos Aliados',
        to: 'Jardim da Praça',
        via: {
          color: "333333",
          mode: "CAR"
        },
        duration: 480
      },
      {
        __dataID__: 4,
        from: 'Santa Catarina',
        to: 'Aliados',
        via: {
          color: "FF7900",
          gtfsId: "1:905",
          longName: "Aliados",
          mode: "BUS",
          shortName: "905"
        },
        duration: 1260,
        walkingDistance: 370
      },
      {
        __dataID__: 5,
        from: 'Aliados',
        to: 'Rua de Fernandes',
        via: {
          color: "6ba3af",
          mode: "WALK"
        },
        duration: 300,
        walkingDistance: 350
      },
    ];

    return (
      <div className={`flex-vertical fullscreen bp-${breakpoint}`}>
        <div
          className="account-history-container"
        >
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

            <div className="stats-container">
              <div className="stat">
                <Stat 
                  icon="car-withoutBox" 
                  textId={"car-emissions"}
                  defaultMessage={"Car emissions"}
                  amount={383.2} 
                  unit={(<>kgCO<sub>2</sub></>)} 
                  percentage={20} 
                  inverted={true}
                />
              </div>
              <div className="stat">
                <Stat 
                  icon="public_transport" 
                  textId={"public-transport"}
                  defaultMessage={"Public transport"}
                  amount={285} 
                  unit="km"
                  percentage={15} 
                />
              </div>
              <div className="stat">
                <Stat 
                  icon="walk" 
                  textId={"walking-distance"}
                  defaultMessage={"Walking distance"}
                  amount={112.5} 
                  unit="km"
                  percentage={31} 
                />
              </div>
              <div className="stat">
                <Stat 
                  icon="walk" 
                  textId={"calories-walked"}
                  defaultMessage={"Calories walked"}
                  amount={11.7} 
                  unit="kcal"
                  percentage={-18} 
                />
              </div>
            </div>
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
            <div className={`fullscreen recent-searches-table-container ${desktop ? 'frontpage-panel' : ''}`}>
              {/* start recent searches section */}
              <DeparturesTable
                headers={[
                  { id: 'origin', defaultMessage: 'Origin' },
                  { id: 'destination', defaultMessage: 'Destination' },
                  { id: 'via', defaultMessage: 'Via' },
                  { id: 'duration', defaultMessage: 'Duration' },
                  { id: 'walk', defaultMessage: 'Walking' },
                ]}
                content={recentSearches.map( s => (
                  <RecentSearchRow 
                    search={s} 
                    key={s.__dataID__}
                  />
                ))}
              />
              {/* end recent searches section */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withBreakpoint(AccountHistoryPage);
