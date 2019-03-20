/* eslint-disable */
import configMerger from '../util/configMerger';
const defaultConfig = require('./config.default').default;
const CONFIG = 'porto';

const API_URL = process.env.API_URL || '';
const MAP_URL = process.env.MAP_URL || '';
const APP_PATH = process.env.APP_CONTEXT || '';
const { PIWIK_ADDRESS, PIWIK_ID, SENTRY_DSN } = process.env;
const PORT = process.env.PORT || 8080;
const APP_DESCRIPTION = 'Multi Modal Transportation journey planning';
const OTP_TIMEOUT = process.env.OTP_TIMEOUT || 10000; // 10k is the current server default
const YEAR = 1900 + new Date().getYear();

export default configMerger(defaultConfig, {
  PIWIK_ADDRESS,
  PIWIK_ID,
  SENTRY_DSN,
  PORT,
  CONFIG,
  OTPTimeout: OTP_TIMEOUT,
  URL: {
    API_URL,
    ASSET_URL: process.env.ASSET_URL,
    MAP_URL,
    OTP: process.env.OTP_URL || '',
    MAP: {
      default: `${MAP_URL}`,
    },
    STOP_MAP: null,
    CITYBIKE_MAP: null,
    PARK_AND_RIDE_MAP: null,
    MQTT: '',
    ALERTS: process.env.ALERTS_URL || '',
    FONT:
      'https://fonts.googleapis.com/css?family=Roboto+Condensed:400,700%7CRoboto:300,400,700',
    REALTIME:
      process.env.VEHICLE_URL || `${API_URL}/realtime/vehicle-positions/v1`,
    PELIAS: `${process.env.GEOCODING_BASE_URL || ''}/search`,
    PELIAS_REVERSE_GEOCODER: `${process.env.GEOCODING_BASE_URL || ''}/reverse`,
  },
  userAuthentication: true,
  FIREBASE: {
    apiKey: process.env.REACT_APP_API_KEY || '',
    authDomain: process.env.REACT_APP_AUTH_DOMAIN || '',
    databaseURL: process.env.REACT_APP_DATABASE_URL || '',
    projectId: process.env.REACT_APP_PROJECT_ID || '',
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET || '',
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID || '',
  },

  APP_PATH: `${APP_PATH}`,
  title: 'UrbanPlatform',

  favicon: './app/configurations/images/porto/favicon.png',

  // Navbar logo
  logo: 'porto/logo.svg',

  spinner: 'porto/spinner.png',

  contactName: {
    default: 'Porto.',
  },

  contactEmail: 'info@portodigital.pt',
  contactSubject: 'MMT - Contact Form',

  // Default labels for manifest creation
  name: 'MMT',
  shortName: 'MMT',

  searchParams: {},
  feedIds: [],

  // Google Tag Manager id
  GTMid: 'GTM-',

  /*
 * by default search endpoints from all but gtfs sources, correct gtfs source
 * figured based on feedIds config variable
 */
  searchSources: ['oa', 'osm'],

  search: {
    suggestions: {
      useTransportIcons: false,
    },
    usePeliasStops: false,
    mapPeliasModality: false,
    peliasMapping: {},
    peliasLayer: null,
    peliasLocalization: null,
    minimalRegexp: new RegExp('.{3,}'),
  },

  nearbyRoutes: {
    radius: 10000,
    bucketSize: 1000,
  },

  maxWalkDistance: 10000,
  maxBikingDistance: 100000,
  itineraryFiltering: 1.5, // drops 66% worse routes
  availableLanguages: ['en', 'pt'],
  defaultLanguage: 'en',
  // This timezone data will expire on 31.12.2020
  timezoneData:
    'Europe/Lisbon|LMT WET WEST WEMT CET CEST|A.J 0 -10 -20 -10 -20|012121212121212121212121212121212121212121212321232123212321212121212121212121212121212121212121214121212121212121212121212121212124545454212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2le00 aPX0 Sp0 LX0 1vc0 Tc0 1uM0 SM0 1vc0 Tc0 1vc0 SM0 1vc0 6600 1co0 3E00 17c0 1fA0 1a00 1io0 1a00 1io0 17c0 3I00 17c0 1cM0 1cM0 3Fc0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Dc0 1tA0 1cM0 1dc0 1400 gL0 IM0 s10 U00 dX0 Rc0 pd0 Rc0 gL0 Oo0 pd0 Rc0 gL0 Oo0 pd0 14o0 1cM0 1cP0 1cM0 1cM0 1cM0 1cM0 1cM0 3Co0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 pvy0 1cM0 1cM0 1fA0 1cM0 1cM0 1cN0 1cL0 1cN0 1cM0 1cM0 1cM0 1cM0 1cN0 1cL0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|27e5',
  mainMenu: {
    // Whether to show the left menu toggle button at all
    show: true,
    showDisruptions: true,
    showLoginCreateAccount: true,
    showOffCanvasList: true,
  },

  itinerary: {
    // How long vehicle should be late in order to mark it delayed. Measured in seconds.
    delayThreshold: 180,
    // Wait time to show "wait leg"? e.g. 180 means over 3 minutes are shown as wait time.
    // Measured in seconds.
    waitThreshold: 180,
    enableFeedback: false,

    timeNavigation: {
      enableButtonArrows: false,
    },
  },

  nearestStopDistance: {
    maxShownDistance: 5000,
  },

  map: {
    useRetinaTiles: true,
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    maxZoom: 50,
    controls: {
      zoom: {
        // available controls positions: 'topleft', 'topright', 'bottomleft, 'bottomright'
        position: 'bottomleft',
      },
      scale: {
        position: 'bottomright',
      },
    },
    genericMarker: {
      // Do not render name markers at zoom levels below this value
      nameMarkerMinZoom: 18,

      popup: {
        offset: [106, 16],
        maxWidth: 250,
        minWidth: 250,
      },
    },

    line: {
      halo: {
        weight: 7,
        thinWeight: 4,
      },

      leg: {
        weight: 5,
        thinWeight: 2,
      },

      passiveColor: '#758993',
    },

    useModeIconsInNonTileLayer: false,
  },

  stopCard: {
    header: {
      showDescription: true,
      showStopCode: true,
      showDistance: true,
    },
  },

  autoSuggest: {
    // Let Pelias suggest based on current user location
    locationAware: true,
  },

  // Lowest level for stops and terminals are rendered
  stopsMinZoom: 13,
  // Highest level when stops and terminals are still rendered as small markers
  stopsSmallMaxZoom: 14,
  // Highest level when terminals are still rendered instead of individual stops
  terminalStopsMaxZoom: 17,
  terminalStopsMinZoom: 12,
  terminalNamesZoom: 16,
  stopsIconSize: {
    small: 8,
    selected: 28,
    default: 18,
  },

  appBarLink: { name: 'MMT', href: 'http://mmt.portodigital.pt' },

  colors: {
    primary: '#0F2F7F',
  },

  sprites: 'svg-sprite.default.svg',

  disruption: {
    showInfoButton: true,
  },

  agency: {
    show: true,
  },

  socialMedia: {
    title: 'MMT',
    description: APP_DESCRIPTION,
    locale: 'pt_PT',

    image: {
      url: '/img/default-social-share.png',
      width: 2400,
      height: 1260,
    },

    twitter: {
      card: 'summary_large_image',
      site: '@porto',
    },
  },

  meta: {
    description: APP_DESCRIPTION,
    keywords: 'mmt',
  },
  // Ticket information feature toggle
  showTicketInformation: true,
  ticketLink: '',
  showRouteInformation: true,

  fares: [ 'Z2', 'Z3', 'Z4', 'Z5', 'Z6', 'Z7', 'Z8', 'Z9', 'Z10', 'Z11', 'Z12'],

  fareMapping: function renameFareId(fareId, _lang) {
    if (fareId && fareId.substring) {
      const zone = fareId.substring(
        fareId.indexOf(':') + 1
      );
      return zone;
    }
    return '';
  },

  //CO2, Calories, Cost
  showExtraCalculations: true,

  modeToOTP: {
    bus: 'BUS',
    tram: 'TRAM',
    rail: 'RAIL',
    subway: 'SUBWAY',
    citybike: 'BICYCLE_RENT',
    airplane: 'AIRPLANE',
    ferry: 'FERRY',
    walk: 'WALK',
    bicycle: 'BICYCLE',
    car: 'CAR',
    car_park: 'CAR_PARK',
  },
  // Control what transport modes that should be possible to select in the UI
  // and whether the transport mode is used in trip planning by default.
  transportModes: {
    bus: {
      availableForSelection: true,
      defaultValue: true,
    },

    tram: {
      availableForSelection: true,
      defaultValue: true,
    },

    rail: {
      availableForSelection: true,
      defaultValue: false,
    },

    subway: {
      availableForSelection: true,
      defaultValue: true,
    },

    citybike: {
      availableForSelection: false, // TODO: Turn off in autumn
      defaultValue: false, // always false
    },

    airplane: {
      availableForSelection: false,
      defaultValue: false,
    },

    ferry: {
      availableForSelection: false,
      defaultValue: false,
    },
  },

  streetModes: {
    walk: {
      availableForSelection: true,
      defaultValue: true,
      icon: 'walk',
    },

    bicycle: {
      availableForSelection: true,
      defaultValue: false,
      icon: 'bicycle-withoutBox',
    },

    car: {
      availableForSelection: true,
      defaultValue: false,
      icon: 'car-withoutBox',
    },

    car_park: {
      availableForSelection: false,
      defaultValue: false,
      icon: 'car_park-withoutBox',
    },
  },

  ticketOptions: [
    {
      displayName: 'No zone restrictions',
      value: '0',
    },
  ],

  accessibilityOptions: [
    {
      messageId: 'accessibility-nolimit',
      displayName: 'No limits',
      value: '0',
    },
    {
      messageId: 'accessibility-limited',
      displayName: 'Wheelchair',
      value: '1',
    },
  ],

  moment: {
    relativeTimeThreshold: {
      seconds: 55,
      minutes: 59,
      hours: 23,
      days: 26,
      months: 11,
    },
  },

  customizeSearch: {
    walkReluctance: {
      available: true,
    },

    walkBoardCost: {
      available: true,
    },

    transferMargin: {
      available: true,
    },

    walkingSpeed: {
      available: true,
    },

    ticketOptions: {
      available: true,
    },

    accessibility: {
      available: true,
    },
    transferpenalty: {
      available: true,
    },
  },

  areaPolygon: [
    [18.776, 60.3316],
    [18.9625, 60.7385],
    [19.8615, 60.8957],
    [20.4145, 61.1942],
    [20.4349, 61.9592],
    [19.7853, 63.2157],
    [20.4727, 63.6319],
    [21.6353, 63.8559],
    [23.4626, 64.7794],
    [23.7244, 65.3008],
    [23.6873, 65.8569],
    [23.2069, 66.2701],
    [23.4627, 66.8344],
    [22.9291, 67.4662],
    [23.0459, 67.9229],
    [20.5459, 68.7605],
    [20.0996, 69.14],
    [21.426, 69.4835],
    [21.9928, 69.4009],
    [22.9226, 68.8678],
    [23.8108, 69.0145],
    [24.6903, 68.8614],
    [25.2262, 69.0596],
    [25.4029, 69.7235],
    [26.066, 70.0559],
    [28.2123, 70.2496],
    [29.5813, 69.7854],
    [29.8467, 69.49],
    [28.9502, 68.515],
    [30.4855, 67.6952],
    [29.4962, 66.9232],
    [30.5219, 65.8728],
    [30.1543, 64.9646],
    [30.9641, 64.1321],
    [30.572, 63.7098],
    [31.5491, 63.3309],
    [31.9773, 62.9304],
    [31.576, 62.426],
    [27.739, 60.1117],
    [26.0945, 59.8015],
    [22.4235, 59.3342],
    [20.2983, 59.2763],
    [19.3719, 59.6858],
    [18.7454, 60.1305],
    [18.776, 60.3316],
  ],

  footer: {
    content: [
      { label: `© MMT ${YEAR}` },
      {},
      {
        name: 'contact-us',
        nameEn: 'Contact us',
        route: '/contact-us',
        icon: 'icon-icon_speech-bubble',
      },
      {
        name: 'about-this-service',
        nameEn: 'About this service',
        route: '/tietoja-palvelusta',
        icon: 'icon-icon_info',
      },
      {
        name: 'terms-and-conditions',
        nameEn: 'Terms and Conditions',
        route: '/terms-and-conditions',
        icon: 'icon-icon_info',
      },
      {
        name: 'privacy-policy',
        nameEn: 'Privacy Policy',
        route: '/privacy-policy',
        icon: 'icon-icon_user',
      },
    ],
  },

  // Default origin endpoint to use when user is outside of area
  defaultEndpoint: {
    address: 'Porto So Bento',
    lat: 41.1452254,
    lon: -8.613206,
  },
  defaultOrigins: [
    {
      icon: 'icon-icon_airplane',
      label: 'Aeroporto Francisco Sá Carneiro',
      lat: 41.2421186,
      lon: -8.6807401,
    },
  ],

  aboutThisService: {
    en: [
      {
        header: 'About this service',
        paragraphs: [
          'The service covers public transport, walking, cycling, and some private car use. Service is built on Digitransit platform.',
        ],
      },
      {
        header: 'Digitransit platform',
        paragraphs: [
          'The Digitransit service platform is an open source routing platform developed by HSL and The Finnish Transport Agency.',
        ],
      },
      {
        header: 'Data sources',
        paragraphs: [
          "Maps, streets, buildings, stop locations etc. are provided by © OpenStreetMap contributors. Address data is retrieved from the Building and Dwelling Register of the Finnish Population Register Center. Public transport routes and timetables are downloaded from Finnish Transport Agency's national public transit database.",
        ],
      },
    ],
    pt: [
      {
        header: 'Sobre este serviço',
        paragraphs: [
          'Este serviço cobre os transportes coletivos, percursos pedonais, ciclovias e transporte individual. Este serviço utiliza a plataforma Digitransit',
        ],
      },
      {
        header: 'Platforma Digitransit',
        paragraphs: [
          'A plataforma Digitransit é uma plataforma open source de itinerários desenvolvida por HSL e The Finnish Transport Agency.',
        ],
      },
      {
        header: 'Fontes de dados',
        paragraphs: [
          "Os mapas, ruas, edifícios etc. são obtidos a partir da comunidade © OpenStreetMap. A informação relativa aos serviços de transportes coletivos foi obtida junto da Área Metropolitana do Porto, Metro do Porto, S.A. e CP, EPE.",
        ],
      },
    ],

  },

  termsAndConditions: {
    en: [
      {
        header: 'Terms of Use of Multi Modal Transportation',
        paragraphs: [''],
      },
      {
        header: '1. Subject of the agreement and the parties',
        paragraphs: [
          'These terms of use for the online service of Multi Modal Transportation are (hereinafter "Services") provided by Associação Porto Digital (hereinafter "Service Provider"). The person using the Services must accept these Terms of Use as binding in order to be able to use the Services.',
          'These terms and conditions shall be applied to all use of contents and materials offered through the Services, unless otherwise indicated or agreed in some respect.'
        ],
      },
      {
        header: '2. Description of the Service',
        paragraphs: [
          'In these Terms of Use, "service" shall refer to the Service Provider\'s online and mobile services, such as Multi Modal Transportation.'
        ],
      },
      {
        header: '3. Using the Service and registering for it',
        paragraphs: [
          'The User subscribes to the Services by registering as a user on the Service website and accepting the Terms of Use as binding. In addition, the Service Provider may require the User to provide certain information upon registration and to accept the Terms of Use. Upon registration, the User shall create a password and enter their e-mail address in the Service which will act as a login ID for the Services in the future. The User shall use the Services by means of these credentials provided upon registration.'
        ],
      },
      {
        header: '4. Register details and use thereof',
        paragraphs: [
          'The User must provide details required by use of the Services. The User\'s personal data shall be stored in Associação Porto Digital’s customer registry. The User\'s personal data shall be processed in accordance with the Terms of Use and with Privacy Policy.'
        ],
      },
      {
        header: '5. Prices',
        paragraphs: [
          'Using the Service shall be free of charge to the User, unless otherwise specifically indicated. The prices and terms of orders and delivery for chargeable Services shall be clearly indicated in connection with each chargeable Service.'
        ],
      },
      {
        header: '6. Content of the Service',
        paragraphs: [
          'The Service Provider shall endeavor to ensure that the Service is of the highest quality possible. The Service Provider shall be responsible for ensuring that the content of the Service complies with valid legislation and good practice.',
          'The Service Provider shall develop the Service, and it shall have the right to alter the Service and its content as part of its ordinary operations in the manner and at the times it sees fit. The Service Provider shall, at any time, be entitled to stop providing the Service either in part or in full.'
        ],
      },
      {
        header: '7. Maintenance of the Service and errors',
        paragraphs: [
          'The Service Provider shall not guarantee error-free or uninterrupted operation of the Service. The Service Provider shall not be responsible for breaks or other similar disruptions or errors caused by technical faults, disruptions in information systems or data communications, harmful software or servicing and installation tasks, or for any delays, alterations or disappearance of data arising from these.',
          'Nor shall the Service Provider be responsible for errors arising from interruptions in data communication links offered by a third party or other services related to data communications or for any errors in such services. The Service Provider shall not be responsible for errors arising from the User using the Services in violation of instructions or orders, or for any errors otherwise caused by the User.'
        ],
      },
      {
        header: '8. Availability of the Service',
        paragraphs: [
          'The Service Provider shall do its best to ensure that the Services are available to the User on a continuous basis and without disruptions. However, the Service Provider shall not be responsible for uninterrupted, timely or error-free operation of the Services. The Service Provider shall not be responsible for any technical faults in the Services, interruptions caused by maintenance or installation tasks, or for any alteration or loss of information contained in the service or other data, or for any problems, disruptions or breaks that arise from third parties and that are related to data transfer.',
          'The Service Provider shall have the right to suspend the Services on account of an alternation or reform, or a technical reason related to the Service; any refitting or installation of the telecommunications network or another similar reason; or should this be required by valid legislation or another regulation issued by a public authority. The Service Provider shall restrict the duration of any such suspension to be as brief as possible. The Service Provider shall give prior notice of the suspension on its website, if possible.'
        ],
      },
      {
        header: '9. Rights to the content of the Service',
        paragraphs: [
          'The content and appearance of the Services are protected by copyright.',
          'Title and all copyright and other intellectual property rights to the Services shall belong to the Service Provider. The User shall receive no rights related to the Services, except the right to use the Services in accordance with these Terms of Use.'
        ],
      },
      {
        header: '10. The User’s right to use the Service',
        paragraphs: [
          'The User shall receive the right to use the Services in accordance with these Terms of Use, instructions, laws, and good practice. The content of such right of use shall be determined in this document on terms of use, which the User must accept as binding in order to be able to register for the Services.',
          'The User shall have the right to use the Services in line with the intended use of the Service in question. The User shall not have the right to copy, distribute, publicly perform or commercially utilize the Service or any part thereof without the written permission of the holder of the right in question. When citing any content of the Services as permissible by law, the User shall be obliged to mention the source in the manner required by good practice.',
          'The User shall be responsible for all costs incurred by use of the Services.',
          'The Service Provider shall have the right to prevent the use of the Services if there is justified cause to suspect that the Services are used in violation of the Terms of Use described in this document or otherwise contrary to good practice or the law.'
        ],
      },
      {
        header: '11. The User’s responsibilities',
        paragraphs: [
          '11.1 Username and password',
          'The User shall be responsible for the storage of the username and password, and for ensuring they are not disclosed to or obtained by any outside parties. The User shall be responsible for all use occurring with their credentials, and for any costs or fees incurred from this.',
          'The Service Provider shall have the right to change the User\'s username or password and any other identifiers required for using the Service should this be necessary for technical or other acceptable reasons. The Service Provider shall not be liable to pay compensation for any change made to such identifiers.',
          'If the username or password is obtained by an outsider or goes missing, the User must immediately change the username or password, or report this to the Service Provider. The User\'s responsibility for the use of such an identifier and any damage caused by such use to another party shall end immediately after the User has submitted such a notification to the Service Provider\'s user service or the User has changed their identifier. The Service Provider may not disclose the User\'s identifiers to any person other than the User without the User\'s authorization or unless required by law.',
          '11.2. Hardware',
          'The User shall be responsible for the acquisition, costs and operation of all hardware, software and data communication links required by the use of the Services. The hardware must not cause any disruptions or other harm to the Services or to other users of the network. When using the Services, the User shall be obliged to comply with the Service Provider\'s valid operating, safety and other instructions, as applicable.',
          '11.3. Information provided by the User',
          'The User must provide all information necessary for using the Services. The Service Provider shall have the right to process the User\'s personal data in accordance with the Personal Data Act and other legislation, and in ways described in detail in the description of the data file.',
          'The User shall have a legal right to prohibit the processing of his or her personal data for the purpose of direct advertising, distance selling or other direct marketing.',
          'The User must immediately report any changes to such information. The User shall be responsible for the accuracy of the information he or she has provided for the Services.',
          '11.4 Material',
          'The Service Provider shall not monitor any material produced, sent, transmitted or otherwise processed through utilization of the Services; nor shall the Service Provider be responsible for any unlawful or offensive content in such material. The User shall be responsible for ensuring that he or she does not produce, send, store or otherwise process any material that violates copyright or other rights, good practice, laws or regulations issued by public authorities. Any such violation may result in an obligation to pay compensation for the damage caused and may lead to penal sanctions. The User shall be responsible, at his or her own expense, for any disputes related to the material as well as any legal and other costs, compensation for damage and any other indemnity obligations arising from the same.',
          'The User shall be responsible for the content and representation of all material sent or otherwise processed by means of or through the Services. If the User can add his or her own material to the Services, the User must, before using such material, ensure that the material does not violate the Terms of Use, Service Agreements or any instructions submitted by the Service Provider, and that the material does not contain any malware or other harmful material. The User agrees not to use the Service for sending any messages or data communications that are harmful or cause damage or disruptions.',
          '11.5. Consequences',
          'If the content of any information provided or material delivered by the User to the Service Provider violates the Terms of Use, Service Agreements or instructions submitted by the Service Provider, the Service Provider shall not be obliged to implement the Services in accordance with the said agreements or the information given by the Service Provider about the Services. If it becomes apparent that material processed by the User through the Services is offensive in terms of content, violates another party\'s copyright or other rights, is contrary to the law, the Terms of Use or the terms and conditions of Service Agreements or may cause damage, the Service Provider shall be entitled to delete such material. Furthermore, the Service Provider shall have the right to cancel the Terms of Use and/or Service Agreement and suspend the use of the Services on account of any misuse.',
        ],
      },
      {
        header: '12. Data security',
        paragraphs: [
          'The User is aware that the network environment and online services are not completely secure. The User shall be responsible for the appropriate management of data security in their own information systems.',
          'The Service Provider shall keep all information pertaining to the User or provided by the User as confidential. The Service Provider shall arrange the data security of its Services efficiently and in a generally accepted manner and endeavor, by appropriate technical solutions, to prevent any unauthorized access to its information systems. However, since the User can use the Services through a public information network, the Service Provider cannot guarantee perfect data security.'
        ],
      },
      {
        header: '13. The Service Provider\'s responsibility and liability for damages',
        paragraphs: [
          'The Service Provider shall not be liable for any indirect damage caused to the customer or for any erroneous operation of the Service, interruptions in use, prevention of use, errors or shortcomings in the Service or its content, any damage arising from a termination of the Service or a part thereof, or for any faults or disruptions to the customer\'s hardware or software. The Service Provider shall not be responsible for any damage caused by the User to him or herself or to others, misuse of the Service or other similar acts. The Service Provider shall not be liable for damage caused by unreasonable difficulties in the operation arising from force majeure or a similar reason. As far as services subject to a charge are concerned, the Service Provider\'s liability for all damage shall be restricted to no more than the amount of the fee paid by the customer for the affected chargeable service for the duration of the damage.'
        ],
      },
      {
        header: '14. Force majeure',
        paragraphs: [
          'Force majeure shall release the Service Provider from all obligations related to the Service if it prevents or unreasonably hinders performance related to the Services. "Force majeure" shall refer to fire, earthquake, flood, explosion, strike or other stoppage of work, official regulation, disruption to the supply of energy, shortage of raw materials or supplies, disruption to cable or other data communications caused by or arising from an outsider, or to another similar reason that was not known and which a party could not reasonably prepare for in advance.',
          'The Service Provider shall report any force majeure on its website immediately after it has become apparent, if it is possible to make such a notification.'
        ],
      },
      {
        header: '15. Amendments to the Terms of Use',
        paragraphs: [
          'The User is aware that the Service Provider develops the Services on a continuous basis, so the selection and content of Services in use may change. The Service Provider shall be entitled to amend these Terms of Use after reporting the amendments on its website in good time before the changes take effect. The Service Provider shall also have the right to stop providing the Services. In such a case, the Service Provider shall have the right to terminate the Terms of Use or Services with regard to parts which are no longer provided.',
          'If the User does not accept the new terms of contract after the Service Provider has reported a change in the agreement, the User shall have the right to terminate the agreement. If the User submits a notice of termination to the Service Provider in the appropriate manner no later than seven days before the new terms and conditions enter into force, the new terms shall not be binding on the User. In such a case, the User shall be bound to the old terms and conditions until the entry into effect of the new terms. The User\'s contractual relationship shall end upon the entry into force of the new terms and conditions, at the latest.'
        ],
      },
      {
        header: '16. Validity and termination of the agreement and the Services',
        paragraphs: [
          'The agreement shall enter into effect with regard to the User after the User has accepted the terms and conditions of the agreement by marking the Terms of Use as accepted, has provided the Service Provider with the registration information needed for opening the Service with a form contained in the Service, and has registered as a user of the service, or after the User has accepted the terms and conditions of the agreement in another manner specifically approved by the Service Provider. The User has registered as a user after the Service Provider has accepted the registration and issued the User with a username and password.',
          'With regard to the Service Provider, the agreement shall enter into force after the Service Provider has approved the user\'s registration. The User shall have the right to cancel the agreement on use of the Service in the Service at any time.',
          'In the following cases, the Service Provider shall have the right to cancel the agreement with immediate effect:',
          'a) If the User has acted willfully or with gross negligence, or if the User has otherwise acted in violation of the Terms of Use and has not rectified its operation immediately after having been informed of the matter',
          'b) If the User has intentionally submitted inaccurate registration details',
          'c) If the Service Provider terminates the Service or makes essential changes to the Service.',
          'The agreement shall enter into effect after it has been accepted by the User through registration, and it shall remain in force until further notice.'
        ],
      },
      {
        header: '17. Transfer of liabilities',
        paragraphs: [
          'Neither party shall have the right to transfer its rights and obligations under the agreement to a third party without the prior written consent of the other party. However, the Service Provider shall have the right to transfer its rights and obligations under the agreement to any organization to which its business operations are transferred.'
        ],
      },
      {
        header: '18. Applicable law and settlement of disputes',
        paragraphs: [
          'These Terms of Use and the Services referred to in these Terms of Use, the service-specific terms and conditions, and any agreement signed on the Service, shall be governed by Portuguese law. Any disputes shall be settled by Porto’s District Court.'
        ],
      },
      {
        header: '19. Other terms and conditions',
        paragraphs: [
          'All rights (title, copyright and other intellectual property rights) to the Services and the material offered by the Service Provider shall belong to the Service Provider or its licensors. Rights to the products and services of other service providers and to related material shall belong to the service providers in question or their licensors.'
        ],
      },
      {
        header: '20. Contact details',
        paragraphs: [
          'Associação Porto Digital’s webpages:',
          'https://www.portodigital.pt',
          'Name: Associação Porto Digital',
          'Visiting address: Rua da Ponte Nova, 70-2º | 4050-485 | Portugal',
          'Postal address: Rua das Flores, 152 | 4050-263 Porto | Portugal',
          'Telephone: +351 222 033 174',
          'E-mail:  info@portodigital.pt'
        ],
      },
    ],
    pt: [
      {
        header: 'Termos de Uso do Transporte Multi Modal',
        paragraphs: [''],
      },
      {
        header: '1. Objecto do acordo e das partes ',
        paragraphs: [
          'Estes termos de uso para o serviço online do Transporte Multi Modal são (doravante denominados "Serviços") fornecidos pela Associação Porto Digital (doravante denominada "Fornecedor de Serviços"). A pessoa que usa os Serviços deve aceitar estes Termos de Uso como vinculativos para poder usar os Serviços.',
          'Estes termos e condições devem ser aplicados a todo o uso de conteúdos e materiais oferecidos através dos Serviços, salvo indicação em contrário ou acordado em alguns aspectos.'
        ],
      }
    ]
  },

  privacyPolicy: {
    en: [
      {
        header: 'Privacy Policy',
        paragraphs: [
          'Effective date: February 12, 2019',
        ],
      },
      {
        header: '',
        paragraphs: [
          'We are very delighted that you have shown interest in our enterprise. Data protection is of a particularly high priority for the management of Associação Porto Digital. The use of the Internet pages of the Associação Porto Digital is possible without any indication of personal data; however, if a data subject wants to use special enterprise services via our website, processing of personal data could become necessary. If the processing of personal data is necessary and there is no statutory basis for such processing, we generally obtain consent from the data subject.',
          'The processing of personal data, such as the name, address, e-mail address, or telephone number of a data subject shall always be in line with the General Data Protection Regulation (GDPR), and in accordance with the country-specific data protection regulations applicable to the Associação Porto Digital. By means of this data protection declaration, our enterprise would like to inform the general public of the nature, scope, and purpose of the personal data we collect, use and process. Furthermore, data subjects are informed, by means of this data protection declaration, of the rights to which they are entitled.',
          'As the controller, the Associação Porto Digital has implemented numerous technical and organizational measures to ensure the most complete protection of personal data processed through this website. However, Internet-based data transmissions may in principle have security gaps, so absolute protection may not be guaranteed. For this reason, every data subject is free to transfer personal data to us via alternative means, e.g. by telephone.',
        ],
      },
      {
        header: '1. Definitions',
        paragraphs: [
          'The data protection declaration of the Associação Porto Digital is based on the terms used by the European legislator for the adoption of the General Data Protection Regulation (GDPR). Our data protection declaration should be legible and understandable for the general public, as well as our customers and business partners. To ensure this, we would like to first explain the terminology used.',
          'In this data protection declaration, we use, inter alia, the following terms:',
        ],
      },
      {
        header: 'a) Personal data',
        paragraphs: [
          'Personal data means any information relating to an identified or identifiable natural person (“data subject”). An identifiable natural person is one who can be identified, directly or indirectly, in particular by reference to an identifier such as a name, an identification number, location data, an online identifier or to one or more factors specific to the physical, physiological, genetic, mental, economic, cultural or social identity of that natural person.',
        ],
      },
      {
        header: 'b) Data subject',
        paragraphs: [
          'Data subject is any identified or identifiable natural person, whose personal data is processed by the controller responsible for the processing.',
        ],
      },
      {
        header: 'c) Processing',
        paragraphs: [
          'Processing is any operation or set of operations which is performed on personal data or on sets of personal data, whether or not by automated means, such as collection, recording, organization, structuring, storage, adaptation or alteration, retrieval, consultation, use, disclosure by transmission, dissemination or otherwise making available, alignment or combination, restriction, erasure or destruction.',
        ],
      },
      {
        header: 'd) Restriction of processing',
        paragraphs: [
          'Restriction of processing is the marking of stored personal data with the aim of limiting their processing in the future.',
        ],
      },
      {
        header: 'e) Profiling',
        paragraphs: [
          'Profiling means any form of automated processing of personal data consisting of the use of personal data to evaluate certain personal aspects relating to a natural person, in particular to analyze or predict aspects concerning that natural person’s performance at work, economic situation, health, personal preferences, interests, reliability, behavior, location or movements.',
        ],
      },
      {
        header: 'f) Pseudonymization',
        paragraphs: [
          'Pseudonymization is the processing of personal data in such a manner that the personal data can no longer be attributed to a specific data subject without the use of additional information, provided that such additional information is kept separately and is subject to technical and organizational measures to ensure that the personal data are not attributed to an identified or identifiable natural person.',
        ],
      },
      {
        header: 'g) Controller or controller responsible for the processing',
        paragraphs: [
          'Controller or controller responsible for the processing is the natural or legal person, public authority, agency or other body which, alone or jointly with others, determines the purposes and means of the processing of personal data; where the purposes and means of such processing are determined by Union or Member State law, the controller or the specific criteria for its nomination may be provided for by Union or Member State law.',
        ],
      },
      {
        header: 'h) Processor',
        paragraphs: [
          'Processor is a natural or legal person, public authority, agency or other body which processes personal data on behalf of the controller.',
        ],
      },
      {
        header: 'i) Recipient',
        paragraphs: [
          'Recipient is a natural or legal person, public authority, agency or another body, to which the personal data are disclosed, whether a third party or not. However, public authorities which may receive personal data in the framework of a particular inquiry in accordance with Union or Member State law shall not be regarded as recipients; the processing of those data by those public authorities shall be in compliance with the applicable data protection rules according to the purposes of the processing.',
        ],
      },
      {
        header: 'j) Third party',
        paragraphs: [
          'Third party is a natural or legal person, public authority, agency or body other than the data subject, controller, processor and persons who, under the direct authority of the controller or processor, are authorised to process personal data.',
        ],
      },
      {
        header: 'k) Consent',
        paragraphs: [
          'Consent of the data subject is any freely given, specific, informed and unambiguous indication of the data subject’s wishes by which he or she, by a statement or by a clear affirmative action, signifies agreement to the processing of personal data relating to him or her.',
        ],
      },
      {
        header: '2. Name and Address of the controller',
        paragraphs: [
          'Controller for the purposes of the General Data Protection Regulation (GDPR), other data protection laws applicable in Member states of the European Union and other provisions related to data protection is:',
          'Associação Porto Digital',
          'Rua das Flores, 152',
          '4050-236 Porto',
          'Portugal',
          'Phone: +351 222 033 174',
          'Email: info@portodigital.pt',
          'Website: http://www.portodigital.pt',
        ],
      },
      {
        header: '3. Address of the Data Protection Officer',
        paragraphs: [
          'The Data Protection Officer of the controller is:',
          'Associação Porto Digital',
          'Rua das Flores, 152',
          '4050-236 Porto',
          'Portugal',
          'Phone: +351 222 033 174',
          'Email: info@portodigital.pt',
          'Website: https://www.portodigital.pt',
          'Any data subject may, at any time, contact our Data Protection Officer directly with all questions and suggestions concerning data protection.',
        ],
      },
      {
        header: '4. Cookies',
        paragraphs: [
          'The Internet pages of the Associação Porto Digital use cookies. Cookies are text files that are stored in a computer system via an Internet browser.',
          'Many Internet sites and servers use cookies. Many cookies contain a so-called cookie ID. A cookie ID is a unique identifier of the cookie. It consists of a character string through which Internet pages and servers can be assigned to the specific Internet browser in which the cookie was stored. This allows visited Internet sites and servers to differentiate the individual browser of the data subject from other Internet browsers that contain other cookies. A specific Internet browser can be recognized and identified using the unique cookie ID.',
          'Through the use of cookies, the Associação Porto Digital can provide the users of this website with more user-friendly services that would not be possible without the cookie setting.',
          'By means of a cookie, the information and offers on our website can be optimized with the user in mind. Cookies allow us, as previously mentioned, to recognize our website users. The purpose of this recognition is to make it easier for users to utilize our website. The website user that uses cookies, e.g. does not have to enter access data each time the website is accessed, because this is taken over by the website, and the cookie is thus stored on the user’s computer system. Another example is the cookie of a shopping cart in an online shop. The online store remembers the articles that a customer has placed in the virtual shopping cart via a cookie.',
          'The data subject may, at any time, prevent the setting of cookies through our website by means of a corresponding setting of the Internet browser used, and may thus permanently deny the setting of cookies. Furthermore, already set cookies may be deleted at any time via an Internet browser or other software programs. This is possible in all popular Internet browsers. If the data subject deactivates the setting of cookies in the Internet browser used, not all functions of our website may be entirely usable.',
        ],
      },
      {
        header: '5. Collection of general data and information',
        paragraphs: [
          'The website of the Associação Porto Digital collects a series of general data and information when a data subject or automated system calls up the website. This general data and information are stored in the server log files. The collected data is comprised by (1) e-mail, (2) avatar, (3) navigation data (origin, destination, CO2 emitted, distance walked, calories burned, transport used, price and route), and (4) user settings.',
          'When using these general data and information, the Associação Porto Digital does not draw any conclusions about the data subject. Rather, this information is needed to (1) deliver the content of our website correctly, (2) optimize the content of our website as well as its advertisement, (3) ensure the long-term viability of our information technology systems and website technology, and (4) provide law enforcement authorities with the information necessary for criminal prosecution in case of a cyber-attack. Therefore, the Associação Porto Digital analyzes anonymously collected data and information statistically, with the aim of increasing the data protection and data security of our enterprise, and to ensure an optimal level of protection for the personal data we process. The anonymous data of the server log files are stored separately from all personal data provided by a data subject.',
        ],
      },
      {
        header: '6. Contact possibility via the website',
        paragraphs: [
          'The website of Multi Modal Transportation (Associação Porto Digital) contains information that enables a quick electronic contact to our enterprise, as well as direct communication with us, which also includes a general address of the so-called electronic mail (e-mail address). If a data subject contacts the controller by e-mail or via a contact form, the personal data transmitted by the data subject are automatically stored. Such personal data transmitted on a voluntary basis by a data subject to the data controller are stored for the purpose of processing or contacting the data subject. There is no transfer of this personal data to third parties.',
        ],
      },
      {
        header: '7. Routine erasure and blocking of personal data',
        paragraphs: [
          'The data controller shall process and store the personal data of the data subject only for the period necessary to achieve the purpose of storage, or as far as this is granted by the European legislator or other legislators in laws or regulations to which the controller is subject to.',
          'If the storage purpose is not applicable, or if a storage period prescribed by the European legislator or another competent legislator expires, the personal data are routinely blocked or erased in accordance with legal requirements.',
        ],
      },
      {
        header: '8. Rights of the data subject',
        paragraphs: [
          '',
        ],
      },
      {
        header: 'a) Right of confirmation',
        paragraphs: [
          'Each data subject shall have the right granted by the European legislator to obtain from the controller the confirmation as to whether or not personal data concerning him or her are being processed. If a data subject wishes to avail himself of this right of confirmation, he or she may, at any time, contact any employee of the controller.',
        ],
      },
      {
        header: 'b) Right of access',
        paragraphs: [
          'Each data subject shall have the right granted by the European legislator to obtain from the controller free information about his or her personal data stored at any time and a copy of this information. Furthermore, the European directives and regulations grant the data subject access to the following information:',
          '· the purposes of the processing;',
          '· the categories of personal data concerned;',
          '· the recipients or categories of recipients to whom the personal data have been or will be disclosed, in particular recipients in third countries or international organizations;',
          '· where possible, the envisaged period for which the personal data will be stored, or, if not possible, the criteria used to determine that period;',
          '· the existence of the right to request from the controller rectification or erasure of personal data, or restriction of processing of personal data concerning the data subject, or to object to such processing;',
          '· the existence of the right to lodge a complaint with a supervisory authority;',
          '· where the personal data are not collected from the data subject, any available information as to their source;',
          '· the existence of automated decision-making, including profiling, referred to in Article 22(1) and (4) of the GDPR and, at least in those cases, meaningful information about the logic involved, as well as the significance and envisaged consequences of such processing for the data subject.',
          'Furthermore, the data subject shall have a right to obtain information as to whether personal data are transferred to a third country or to an international organization. Where this is the case, the data subject shall have the right to be informed of the appropriate safeguards relating to the transfer.',
          'If a data subject wishes to avail himself of this right of access, he or she may, at any time, contact any employee of the controller.',
        ],
      },
      {
        header: 'c) Right to rectification',
        paragraphs: [
          'Each data subject shall have the right granted by the European legislator to obtain from the controller without undue delay the rectification of inaccurate personal data concerning him or her. Taking into account the purposes of the processing, the data subject shall have the right to have incomplete personal data completed, including by means of providing a supplementary statement.',
          'If a data subject wishes to exercise this right to rectification, he or she may, at any time, contact any employee of the controller.',
        ],
      },
      {
        header: 'd) Right to erasure (Right to be forgotten)',
        paragraphs: [
          'Each data subject shall have the right granted by the European legislator to obtain from the controller the erasure of personal data concerning him or her without undue delay, and the controller shall have the obligation to erase personal data without undue delay where one of the following grounds applies, as long as the processing is not necessary:',
          '· The personal data are no longer necessary in relation to the purposes for which they were collected or otherwise processed.',
          '· The data subject withdraws consent to which the processing is based according to point (a) of Article 6(1) of the GDPR, or point (a) of Article 9(2) of the GDPR, and where there is no other legal ground for the processing.',
          '· The data subject objects to the processing pursuant to Article 21(1) of the GDPR and there are no overriding legitimate grounds for the processing, or the data subject objects to the processing pursuant to Article 21(2) of the GDPR.',
          '· The personal data have been unlawfully processed.',
          '· The personal data must be erased for compliance with a legal obligation in Union or Member State law to which the controller is subject.',
          '· The personal data have been collected in relation to the offer of information society services referred to in Article 8(1) of the GDPR.',
          'If one of the aforementioned reasons applies, and a data subject wishes to request the erasure of personal data stored by the Associação Porto Digital, he or she may, at any time, contact any employee of the controller. An employee of Associação Porto Digital shall promptly ensure that the erasure request is complied with immediately.',
          'Where the controller has made personal data public and is obliged pursuant to Article 17(1) to erase the personal data, the controller, taking account of available technology and the cost of implementation, shall take reasonable steps, including technical measures, to inform other controllers processing the personal data that the data subject has requested erasure by such controllers of any links to, or copy or replication of, those personal data, as far as processing is not required. An employee of the Associação Porto Digital will arrange the necessary measures in individual cases.',
        ],
      },
      {
        header: 'e) Right of restriction of processing',
        paragraphs: [
          'Each data subject shall have the right granted by the European legislator to obtain from the controller restriction of processing where one of the following applies:',
          '· The accuracy of the personal data is contested by the data subject, for a period enabling the controller to verify the accuracy of the personal data.',
          '· The processing is unlawful, and the data subject opposes the erasure of the personal data and requests instead the restriction of their use instead.',
          '· The controller no longer needs the personal data for the purposes of the processing, but they are required by the data subject for the establishment, exercise or defense of legal claims.',
          '· The data subject has objected to processing pursuant to Article 21(1) of the GDPR pending the verification whether the legitimate grounds of the controller override those of the data subject.',
          'If one of the aforementioned conditions is met, and a data subject wishes to request the restriction of the processing of personal data stored by the Associação Porto Digital, he or she may at any time contact any employee of the controller. The employee of the Associação Porto Digital will arrange the restriction of the processing.',
        ],
      },
      {
        header: 'f) Right to data portability',
        paragraphs: [
          'Each data subject shall have the right granted by the European legislator, to receive the personal data concerning him or her, which was provided to a controller, in a structured, commonly used and machine-readable format. He or she shall have the right to transmit those data to another controller without hindrance from the controller to which the personal data have been provided, as long as the processing is based on consent pursuant to point (a) of Article 6(1) of the GDPR or point (a) of Article 9(2) of the GDPR, or on a contract pursuant to point (b) of Article 6(1) of the GDPR, and the processing is carried out by automated means, as long as the processing is not necessary for the performance of a task carried out in the public interest or in the exercise of official authority vested in the controller.',
          'Furthermore, in exercising his or her right to data portability pursuant to Article 20(1) of the GDPR, the data subject shall have the right to have personal data transmitted directly from one controller to another, where technically feasible and when doing so does not adversely affect the rights and freedoms of others.',
          'In order to assert the right to data portability, the data subject may at any time contact any employee of the Associação Porto Digital.',
        ],
      },
      {
        header: 'g) Right to object',
        paragraphs: [
          'Each data subject shall have the right granted by the European legislator to object, on grounds relating to his or her particular situation, at any time, to processing of personal data concerning him or her, which is based on point (e) or (f) of Article 6(1) of the GDPR. This also applies to profiling based on these provisions.',
          'The Associação Porto Digital shall no longer process the personal data in the event of the objection, unless we can demonstrate compelling legitimate grounds for the processing which override the interests, rights and freedoms of the data subject, or for the establishment, exercise or defense of legal claims.',
          'If the Associação Porto Digital processes personal data for direct marketing purposes, the data subject shall have the right to object at any time to processing of personal data concerning him or her for such marketing. This applies to profiling to the extent that it is related to such direct marketing. If the data subject objects to the Associação Porto Digital to the processing for direct marketing purposes, the Associação Porto Digital will no longer process the personal data for these purposes.',
          'In addition, the data subject has the right, on grounds relating to his or her particular situation, to object to processing of personal data concerning him or her by the Associação Porto Digital for scientific or historical research purposes, or for statistical purposes pursuant to Article 89(1) of the GDPR, unless the processing is necessary for the performance of a task carried out for reasons of public interest.',
          'In order to exercise the right to object, the data subject may contact any employee of the Associação Porto Digital. In addition, the data subject is free in the context of the use of information society services, and notwithstanding Directive 2002/58/EC, to use his or her right to object by automated means using technical specifications.',
        ],
      },
      {
        header: 'h) Automated individual decision-making, including profiling',
        paragraphs: [
          'Each data subject shall have the right granted by the European legislator not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects concerning him or her, or similarly significantly affects him or her, as long as the decision (1) is not is necessary for entering into, or the performance of, a contract between the data subject and a data controller, or (2) is not authorized by Union or Member State law to which the controller is subject and which also lays down suitable measures to safeguard the data subject’s rights and freedoms and legitimate interests, or (3) is not based on the data subject’s explicit consent.',
          'If the decision (1) is necessary for entering into, or the performance of, a contract between the data subject and a data controller, or (2) it is based on the data subject’s explicit consent, the Associação Porto Digital shall implement suitable measures to safeguard the data subject’s rights and freedoms and legitimate interests, at least the right to obtain human intervention on the part of the controller, to express his or her point of view and contest the decision.',
          'If the data subject wishes to exercise the rights concerning automated individual decision-making, he or she may, at any time, contact any employee of the Associação Porto Digital.',
        ],
      },
      {
        header: 'i) Right to withdraw data protection consent',
        paragraphs: [
          'Each data subject shall have the right granted by the European legislator to withdraw his or her consent to processing of his or her personal data at any time.',
          'If the data subject wishes to exercise the right to withdraw the consent, he or she may, at any time, contact any employee of the Associação Porto Digital.',
        ],
      },
      {
        header: '9. Data protection provisions about the application and use of Google Analytics (with anonymization function)',
        paragraphs: [
          'On this website, the controller has integrated the component of Google Analytics (with the anonymizer function). Google Analytics is a web analytics service. Web analytics is the collection, gathering, and analysis of data about the behavior of visitors to websites. A web analysis service collects, inter alia, data about the website from which a person has come (the so-called referrer), which sub-pages were visited, or how often and for what duration a sub-page was viewed. Web analytics are mainly used for the optimization of a website and in order to carry out a cost-benefit analysis of Internet advertising.',
          'The operator of the Google Analytics component is Google Inc., 1600 Amphitheatre Pkwy, Mountain View, CA 94043-1351, United States.',
          'For the web analytics through Google Analytics the controller uses the application “_gat. _anonymizeIp”. By means of this application the IP address of the Internet connection of the data subject is abridged by Google and anonymized when accessing our websites from a Member State of the European Union or another Contracting State to the Agreement on the European Economic Area.',
          'The purpose of the Google Analytics component is to analyze the traffic on our website. Google uses the collected data and information, inter alia, to evaluate the use of our website and to provide online reports, which show the activities on our websites, and to provide other services concerning the use of our Internet site for us.',
          'Google Analytics places a cookie on the information technology system of the data subject. The definition of cookies is explained above. With the setting of the cookie, Google is enabled to analyze the use of our website. With each call-up to one of the individual pages of this Internet site, which is operated by the controller and into which a Google Analytics component was integrated, the Internet browser on the information technology system of the data subject will automatically submit data through the Google Analytics component for the purpose of online advertising and the settlement of commissions to Google. During the course of this technical procedure, the enterprise Google gains knowledge of personal information, such as the IP address of the data subject, which serves Google, inter alia, to understand the origin of visitors and clicks, and subsequently create commission settlements.',
          'The cookie is used to store personal information, such as the access time, the location from which the access was made, and the frequency of visits of our website by the data subject. With each visit to our Internet site, such personal data, including the IP address of the Internet access used by the data subject, will be transmitted to Google in the United States of America. These personal data are stored by Google in the United States of America. Google may pass these personal data collected through the technical procedure to third parties.',
          'The data subject may, as stated above, prevent the setting of cookies through our website at any time by means of a corresponding adjustment of the web browser used and thus permanently deny the setting of cookies. Such an adjustment to the Internet browser used would also prevent Google Analytics from setting a cookie on the information technology system of the data subject. In addition, cookies already in use by Google Analytics may be deleted at any time via a web browser or other software programs.',
          'In addition, the data subject has the possibility of objecting to a collection of data that are generated by Google Analytics, which is related to the use of this website, as well as the processing of this data by Google and the chance to preclude any such. For this purpose, the data subject must download a browser add-on under the link https://tools.google.com/dlpage/gaoptout and install it. This browser add-on tells Google Analytics through a JavaScript, that any data and information about the visits of Internet pages may not be transmitted to Google Analytics. The installation of the browser add-ons is considered an objection by Google. If the information technology system of the data subject is later deleted, formatted, or newly installed, then the data subject must reinstall the browser add-ons to disable Google Analytics. If the browser add-on was uninstalled by the data subject or any other person who is attributable to their sphere of competence, or is disabled, it is possible to execute the reinstallation or reactivation of the browser add-ons.',
          'Further information and the applicable data protection provisions of Google may be retrieved under https://www.google.com/intl/en/policies/privacy/ and under http://www.google.com/analytics/terms/us.html. Google Analytics is further explained under the following Link https://www.google.com/analytics/.',
        ],
      },
      {
        header: '10. Legal basis for the processing',
        paragraphs: [
          'Art. 6(1) lit. a GDPR serves as the legal basis for processing operations for which we obtain consent for a specific processing purpose. If the processing of personal data is necessary for the performance of a contract to which the data subject is party, as is the case, for example, when processing operations are necessary for the supply of goods or to provide any other service, the processing is based on Article 6(1) lit. b GDPR. The same applies to such processing operations which are necessary for carrying out pre-contractual measures, for example in the case of inquiries concerning our products or services. Is our company subject to a legal obligation by which processing of personal data is required, such as for the fulfillment of tax obligations, the processing is based on Art. 6(1) lit. c GDPR.',
          'In rare cases, the processing of personal data may be necessary to protect the vital interests of the data subject or of another natural person. This would be the case, for example, if a visitor were injured in our company and his name, age, health insurance data or other vital information would have to be passed on to a doctor, hospital or other third party. Then the processing would be based on Art. 6(1) lit. d GDPR.',
          'Finally, processing operations could be based on Article 6(1) lit. f GDPR. This legal basis is used for processing operations which are not covered by any of the abovementioned legal grounds, if processing is necessary for the purposes of the legitimate interests pursued by our company or by a third party, except where such interests are overridden by the interests or fundamental rights and freedoms of the data subject which require protection of personal data. Such processing operations are particularly permissible because they have been specifically mentioned by the European legislator. He considered that a legitimate interest could be assumed if the data subject is a client of the controller (Recital 47 Sentence 2 GDPR).',
        ],
      },
      {
        header: '11. The legitimate interests pursued by the controller or by a third party',
        paragraphs: [
          'Where the processing of personal data is based on Article 6(1) lit. f GDPR our legitimate interest is to carry out our business in favor of the well-being of all our employees and the shareholders.',
        ],
      },
      {
        header: '12. Period for which the personal data will be stored',
        paragraphs: [
          'The criteria used to determine the period of storage of personal data is the respective statutory retention period. After expiration of that period, the corresponding data is routinely deleted, as long as it is no longer necessary for the fulfillment of the contract or the initiation of a contract.',
        ],
      },
      {
        header: '13. Provision of personal data as statutory or contractual requirement; Requirement necessary to enter into a contract; Obligation of the data subject to provide the personal data; possible consequences of failure to provide such data',
        paragraphs: [
          'We clarify that the provision of personal data is partly required by law (e.g. tax regulations) or can also result from contractual provisions (e.g. information on the contractual partner).',
          'Sometimes it may be necessary to conclude a contract that the data subject provides us with personal data, which must subsequently be processed by us. The data subject is, for example, obliged to provide us with personal data when our company signs a contract with him or her. The non-provision of the personal data would have the consequence that the contract with the data subject could not be concluded.',
          'Before personal data is provided by the data subject, the data subject must contact any employee. The employee clarifies to the data subject whether the provision of the personal data is required by law or contract or is necessary for the conclusion of the contract, whether there is an obligation to provide the personal data and the consequences of non-provision of the personal data.',
        ],
      },
      {
        header: '14. Existence of automated decision-making',
        paragraphs: [
          'As a responsible company, we do not use automatic decision-making or profiling.',
        ],
      },
      {
        header: '',
        paragraphs: [
          'This Privacy Policy has been generated by the Privacy Policy Generator of the German Association for Data Protection that was developed in cooperation with Privacy Lawyers from WILDE BEUGER SOLMECKE, Cologne.',
        ],
      },
    ],
    pt: [
      {
        header: 'Política de Privacidade',
        paragraphs: [
          'Data de vigência: 12 de fevereiro de 2019',
        ]
      },
      {
        header: '',
        paragraphs: [
          'Estamos muito satisfeitos por você ter mostrado interesse em nosso empreendimento. A proteção de dados é uma prioridade particularmente alta para a gestão da Associação Porto Digital. O uso das páginas da Internet da Associação Porto Digital é possível sem qualquer indicação de dados pessoais; no entanto, se um titular de dados quiser usar serviços empresariais especiais através do nosso site, o processamento de dados pessoais poderá ser necessário. Se o processamento de dados pessoais for necessário e não houver base legal para tal processamento, geralmente obtemos o consentimento do titular dos dados.',
          'O tratamento de dados pessoais, como o nome, endereço, endereço de correio eletrónico ou número de telefone de um titular de dados, deve estar sempre em consonância com o Regulamento Geral de Proteção de Dados (GDPR) e de acordo com os dados específicos do país. regulamentos de proteção aplicáveis ​​à Associação Porto Digital. Por meio desta declaração de proteção de dados, nossa empresa gostaria de informar ao público em geral a natureza, o escopo e a finalidade dos dados pessoais que coletamos, usamos e processamos. Além disso, os titulares dos dados são informados, através desta declaração de proteção de dados, dos direitos a que têm direito.',
          'Como controladora, a Associação Porto Digital implementou inúmeras medidas técnicas e organizacionais para garantir a mais completa proteção dos dados pessoais processados ​​através deste site. No entanto, as transmissões de dados baseadas na Internet podem, em princípio, ter lacunas de segurança, portanto a proteção absoluta pode não ser garantida. Por este motivo, todos os titulares dos dados são livres de nos transferir dados pessoais através de meios alternativos, por ex. pelo telefone.',
        ]
      }
    ]
  },

  staticMessages: [
    {
      id: 'consent',
      priority: -1,
      content: {
        en: [
          {
            type: 'text',
            content:
              'We use cookies and other methods to process your personal data in order to customise content and your site experience. Please confirm you accept this use of your data. For more information visit our ',
          },
          {
            type: 'a',
            content: 'Terms of Use',
            href: '/terms-and-conditions',
          },
          {
            type: 'a',
            content: 'Privacy Statement',
            href: '/privacy-policy',
          }
        ],
        pt: [
          {
            type: 'text',
            content:
              'Este website utiliza cookies e outros métodos para processar a sua informação pessoal de forma a customizar o conteúdo e melhorar a sua experiência. Por favor, confirme que aceita esta utilização da sua informação. Ler mais:',
          },
          {
            type: 'a',
            content: 'Termos e Condições',
            href: '/terms-and-conditions',
          },
          {
            type: 'a',
            content: 'Política de Privacidade',
            href: '/privacy-policy',
          },
        ],
      },
    },
  ],

  geoJson: {
    layers: [
      {
        name: {
          fi: 'POI',
          sv: 'POI',
          en: 'POI',
          pt: 'POI',
        },
        url: '//desolate-falls-11658.herokuapp.com/pois',
        options: {
          cluster: true,
          maxMarkers: 150,
        }
      },
      {
        name: {
          fi: 'BUS STOP',
          sv: 'BUS STOP',
          en: 'BUS STOP',
          pt: 'Paragem de autocarro',
        },
        url: '//desolate-falls-11658.herokuapp.com/bus_stops',
        options: {
          minZoom: 16,
          maxMarkers: 200,
        }
      },
      {
        name: {
          fi: 'Metro',
          sv: 'Metro',
          en: 'Metro',
          pt: 'Metro',
        },
        url: '//desolate-falls-11658.herokuapp.com/metro_stops',
        options: {
          minZoom: 16,
          maxMarkers: 200,
        }
      },
    ],
  },

  themeMap: {
    porto: 'porto',
  },

  piwikMap: [
    // in priority order. 1st match stops
    { id: '10', expr: 'dev-joensuu' },
    { id: '11', expr: 'joensuu' },
    { id: '12', expr: 'dev-turku' },
    { id: '27', expr: '(turku|foli)' },
    { id: '14', expr: 'hameenlinna' },
    { id: '15', expr: 'jyvaskyla' },
    { id: '16', expr: 'kuopio' },
    { id: '17', expr: 'lahti' },
    { id: '18', expr: 'lappeenranta' },
    { id: '21', expr: 'oulu' },
    { id: '29', expr: 'kotka' },
    { id: '31', expr: 'mikkeli' },
    { id: '35', expr: 'tampere' },
    { id: '43', expr: 'kouvola' },
    { id: '49', expr: 'rovaniemi' },
    // put generic expressions last so that they do not match waltti cities
    // e.g. reittiopas.hameenlinna.fi or turku.digitransit.fi
    { id: '5', expr: 'dev.reittiopas' },
    { id: '4', expr: 'reittiopas' },
    { id: '7', expr: 'dev.matka' },
    { id: '6', expr: 'matka' },
    { id: '7', expr: 'dev.digitransit' },
    { id: '6', expr: 'digitransit' },
  ],

  minutesToDepartureLimit: 9,

  imperialEnabled: false,
  // this flag when true enables imperial measurements  'feet/miles system'
});
