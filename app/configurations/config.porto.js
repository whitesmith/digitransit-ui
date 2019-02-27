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
    STOP_MAP: '',
    CITYBIKE_MAP: '',
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

  contactEmail: 'some.support.email@portofigital.pt',

  // Default labels for manifest creation
  name: 'MMT',
  shortName: 'MMT',

  searchParams: {},
  feedIds: [],

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

  // TODO: Switch off in autumn
  cityBike: {
    showCityBikes: true,
    showStationId: true,

    useUrl: {
      en: 'https://www.hsl.fi/en/citybikes',
    },

    cityBikeMinZoom: 14,
    cityBikeSmallIconZoom: 14,
    // When should bikeshare availability be rendered in orange rather than green
    fewAvailableCount: 3,
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
  showTicketInformation: false,
  showRouteInformation: true,
  
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
        header: 'Terms and Conditions',
        paragraphs: [
          'These terms and conditions outline the rules and regulations for the use of MMT PortoDigital’s Website.',
          'By accessing this website we assume you accept these terms and conditions in full. Do not continue to use MMT PortoDigital’s website if you do not accept all of the terms and conditions stated on this page.',
          'The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and any or all Agreements: “Client”, “You” and “Your” refers to you, the person accessing this website and accepting the Company’s terms and conditions. “The Company”, “Ourselves”, “We”, “Our” and “Us”, refers to our Company. “Party”, “Parties”, or “Us”, refers to both the Client and ourselves, or either the Client or ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner, whether by formal meetings of a fixed duration, or any other means, for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services/products, in accordance with and subject to, prevailing law of . Any use of the above terminology or other words in the singular, plural, capitalisation and/or he/she or they, are taken as interchangeable and therefore as referring to same.',
        ],
      },
      {
        header: 'Cookies',
        paragraphs: [
          'We employ the use of cookies. By using MMT PortoDigital’s website you consent to the use of cookies in accordance with MMT PortoDigital’s privacy policy.',
          'Most of the modern day interactive web sites use cookies to enable us to retrieve user details for each visit. Cookies are used in some areas of our site to enable the functionality of this area and ease of use for those people visiting. Some of our affiliate / advertising partners may also use cookies.',
        ],
      },
      {
        header: 'License',
        paragraphs: [
          'Unless otherwise stated, MMT PortoDigital and/or it’s licensors own the intellectual property rights for all material on MMT PortoDigital. All intellectual property rights are reserved. You may view and/or print pages from http://mmt.portodigital.pt for your own personal use subject to restrictions set in these terms and conditions.',
          'You must not:',
          '· Republish material from http://mmt.portodigital.pt',
          '· Sell, rent or sub-license material from http://mmt.portodigital.pt',
          '· Reproduce, duplicate or copy material from http://mmt.portodigital.pt',
          'Redistribute content from MMT PortoDigital (unless content is specifically made for redistribution)',
        ],
      },
      {
        header: 'Reservation of Rights',
        paragraphs: [
          'We reserve the right at any time and in its sole discretion to request that you remove all links or any particular link to our Web site. You agree to immediately remove all links to our Web site upon such request. We also reserve the right to amend these terms and conditions and its linking policy at any time. By continuing to link to our Web site, you agree to be bound to and abide by these linking terms and conditions.',
        ],
      },
      {
        header: 'Content Liability',
        paragraphs: [
          'We shall have no responsibility or liability for any content appearing on your Web site. You agree to indemnify and defend us against all claims arising out of or based upon your Website. No link(s) may appear on any page on your Web site or within any context containing content or materials that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.',
        ],
      },
      {
        header: 'Disclaimer',
        paragraphs: [
          'To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website (including, without limitation, any warranties implied by law in respect of satisfactory quality, fitness for purpose and/or the use of reasonable care and skill). Nothing in this disclaimer will:',
          '· limit or exclude our or your liability for death or personal injury resulting from negligence;',
          '· limit or exclude our or your liability for fraud or fraudulent misrepresentation;',
          '· limit any of our or your liabilities in any way that is not permitted under applicable law; or',
          '· exclude any of our or your liabilities that may not be excluded under applicable law.',
          'The limitations and exclusions of liability set out in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer or in relation to the subject matter of this disclaimer, including liabilities arising in contract, in tort (including negligence) and for breach of statutory duty.',
          'To the extent that the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.',
        ],
      },
    ],
    pt: [
      {
        header: 'Termos e Condições',
        paragraphs: [
          'Estes termos e condições descrevem as regras e regulamentos para o uso do site MMT PortoDigital.',
          'Ao acessar este site, assumimos que você aceita estes termos e condições na íntegra. Não continue usando o site da MMT PortoDigital se você não aceitar todos os termos e condições indicados nesta página.',
          'A seguinte terminologia aplica-se a estes Termos e Condições, Declaração de Privacidade e Aviso de Isenção e qualquer ou todos os Contratos: "Cliente", "Você" e "Seu" referem-se a você, a pessoa que acessa este site e aceita os termos e condições da Empresa. “A Companhia”, “Nós mesmos”, “Nós”, “Nosso” e “Nós”, referem-se à nossa Companhia. “Party”, “Parties” ou “Us” refere-se tanto ao Cliente quanto a nós mesmos, ou ao Cliente ou a nós mesmos. Todos os termos referem-se à oferta, aceitação e consideração do pagamento necessário para levar a cabo o processo de nossa assistência ao Cliente da maneira mais apropriada, seja por meio de reuniões formais de duração determinada ou por qualquer outro meio, com o propósito expresso de atender o cliente. As necessidades do cliente em relação ao fornecimento dos serviços / produtos declarados da Empresa, de acordo com e sujeitos à lei prevalecente de. Qualquer uso da terminologia acima ou de outras palavras no singular, plural, capitalização e / ou ele / ela ou eles, são tomados como intercambiáveis ​​e, portanto, como referentes aos mesmos.',
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
          'Porto Digital ("us", "we", or "our") operates the http://mmt.portodigital.pt website (the "Service").',
          'This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.',
          'We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, accessible from http://mmt.portodigital.pt',
        ],
      },
      {
        header: 'Information Collection And Use',
        paragraphs: [
          'We collect several different types of information for various purposes to provide and improve our Service to you.',
        ],
      },
      {
        header: 'Types of Data Collected',
        paragraphs: [],
      },
      {
        header: 'Personal Data',
        paragraphs: [
          'While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:',
          'Email address',
          'First name and last name',
          'Cookies and Usage Data',
        ],
      },
      {
        header: 'Usage Data',
        paragraphs: [
          'We may also collect information how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer’s Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.',
        ],
      },
      {
        header: 'Tracking & Cookies Data',
        paragraphs: [
          'We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.',
          'Cookies are files with small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyze our Service.',
          'You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.',
          'Examples of Cookies we use:',
          'Session Cookies.',
          'We use Session Cookies to operate our Service.',
          'Preference Cookies.',
          'We use Preference Cookies to remember your preferences and various settings.',
          'Security Cookies.',
          'We use Security Cookies for security purposes.',
        ],
      },
      {
        header: 'Use of Data',
        paragraphs: [
          'Porto Digital uses the collected data for various purposes:</p>',
          'To provide and maintain the Service',
          'To notify you about changes to our Service',
          'To allow you to participate in interactive features of our Service when you choose to do so',
          'To provide customer care and support',
          'To provide analysis or valuable information so that we can improve the Service',
          'To monitor the usage of the Service',
          'To detect, prevent and address technical issues',
        ],
      },
      {
        header: 'Transfer Of Data',
        paragraphs: [
          'Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.',
          'If you are located outside Portugal and choose to provide information to us, please note that we transfer the data, including Personal Data, to Portugal and process it there.',
          'Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.',
          'Porto Digital will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of your data and other personal information.',
        ],
      },
      {
        header: 'Disclosure Of Data',
      },
      {
        header: 'Legal Requirements',
        paragraphs: [
          'Porto Digital may disclose your Personal Data in the good faith belief that such action is necessary to:',
          'To comply with a legal obligation',
          'To protect and defend the rights or property of Porto Digital',
          'To prevent or investigate possible wrongdoing in connection with the Service',
          'To protect the personal safety of users of the Service or the public',
          'To protect against legal liability',
        ],
      },
      {
        header: 'Security Of Data',
        paragraphs: [
          'The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.',
        ],
      },
      {
        header: 'Service Providers',
        paragraphs: [
          'We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.',
          'These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.',
        ],
      },
      {
        header: 'Analytics',
        paragraphs: [
          'We may use third-party Service Providers to monitor and analyze the use of our Service.',
          'Mixpanel',
          'Mixpanel is provided by Mixpanel Inc',
          'You can prevent Mixpanel from using your information for analytics purposes by opting-out. To opt-out of Mixpanel service, please visit this page: https://mixpanel.com/optout/',
          'For more information on what type of information Mixpanel collects, please visit the Terms of Use page of Mixpanel: https://mixpanel.com/terms/',
        ],
      },
      {
        header: 'Links To Other Sites',
        paragraphs: [
          'Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party’s site. We strongly advise you to review the Privacy Policy of every site you visit.',
          'We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.',
        ],
      },
      {
        header: 'Children’s Privacy',
        paragraphs: [
          'Our Service does not address anyone under the age of 18 ("Children").',
          'We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.',
        ],
      },
      {
        header: 'Changes To This Privacy Policy',
        paragraphs: [
          'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.',
          'We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy.',
          'You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.',
        ],
      },
      {
        header: 'Contact Us',
        paragraphs: [
          'If you have any questions about this Privacy Policy, please contact us:',
          'By email: info@portodigital.pt',
        ],
      },
    ],
    pt: [
      {
        header: 'Política de Privacidade',
        paragraphs: [
          'Data de vigência: 12 de fevereiro de 2019',
          'O Porto Digital ("nós", "nós" ou "nosso") opera o site http://mmt.portodigital.pt (o "Serviço").',
          'Esta página informa sobre nossas políticas relativas à coleta, uso e divulgação de dados pessoais quando você usa nosso Serviço e as opções que você associou a esses dados.',
          'Usamos seus dados para fornecer e melhorar o serviço. Ao usar o Serviço, você concorda com a coleta e uso de informações de acordo com esta política. Salvo disposição em contrário nesta Política de Privacidade, os termos utilizados nesta Política de Privacidade têm os mesmos significados que os nossos Termos e Condições, acessíveis em http://mmt.portodigital.pt',
        ],
      }
    ]
  },

  staticMessages: [],

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
