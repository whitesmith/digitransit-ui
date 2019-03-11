import Icon from '../../Icon';

const GeoJsonPopup = (props) => (`
  <div class="card">
    <div class="padding-small">
      <div class="card-header">
        <div class="left" >
          ${Icon.asString(props.icon)}
        </div>
        <div class="card-header-wrapper">
          <span class="h4">${props.name}</span>
          <div class="card-sub-header">
            <p class="sub-header-h4">${props.content}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
`);

export default GeoJsonPopup;