export default{
  expo: {
    name: "hearthospital-mobile",
    slug: "hearthospital-mobile",
    scheme: "jp.hearthospital",
    version: "1.1.3",
    orientation: "portrait",
    icon: "./assets/icon(1024x1024).png",
    splash: {
      "image": "./assets/splash-icon(414x896).png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    userInterfaceStyle: "light",
    newArchEnabled: true,
    ios: {
      bundleIdentifier: "jp.hearthospital",
      buildNumber: "1.1.3",
      supportsTablet: false,
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAP_API_KEY_FOR_IOS
      },
      usesAppleSignIn: true,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      package: "jp.hearthospital",
      versionCode: 13,
      permissions: [],
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive(432x432).png",
        backgroundColor: "#FFFFFF"
      },
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAP_API_KEY_FOR_ANDROID
        }
      }
    },
    web: {
      favicon: "./assets/favicon(48x48).png"
    },
    androidStatusBar: {
      hidden: true
    },
    plugins: [
      [
        'expo-tracking-transparency',
        {
          userTrackingPermission:
            'Allow this app to collect app-related data that can be used for tracking you or your device and deliver personalized ads to you.'
        }
      ],
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ],
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": process.env.ANDROID_APP_ID,
          "iosAppId": process.env.IOS_APP_ID,
          "userTrackingUsageDescription": "This identifier will be used to deliver personalized ads to you.",
          "skAdNetworkItems": [
            "cstr6suwn9.skadnetwork",
            "4fzdc2evr5.skadnetwork",
            "2fnua5tdw4.skadnetwork",
            "ydx93a7ass.skadnetwork",
            "p78axxw29g.skadnetwork",
            "v72qych5uu.skadnetwork",
            "ludvb6z3bs.skadnetwork",
            "cp8zw746q7.skadnetwork",
            "3sh42y64q3.skadnetwork",
            "c6k4g5qg8m.skadnetwork",
            "s39g8k73mm.skadnetwork",
            "3qy4746246.skadnetwork",
            "hs6bdukanm.skadnetwork",
            "mlmmfzh3r3.skadnetwork",
            "v4nxqhlyqp.skadnetwork",
            "wzmmz9fp6w.skadnetwork",
            "su67r6k2v3.skadnetwork",
            "yclnxrl5pm.skadnetwork",
            "7ug5zh24hu.skadnetwork",
            "gta9lk7p23.skadnetwork",
            "vutu7akeur.skadnetwork",
            "y5ghdn5j9k.skadnetwork",
            "v9wttpbfk9.skadnetwork",
            "n38lu8286q.skadnetwork",
            "47vhws6wlr.skadnetwork",
            "kbd757ywx3.skadnetwork",
            "9t245vhmpl.skadnetwork",
            "a2p9lx4jpn.skadnetwork",
            "22mmun2rn5.skadnetwork",
            "4468km3ulz.skadnetwork",
            "2u9pt9hc89.skadnetwork",
            "8s468mfl3y.skadnetwork",
            "ppxm28t8ap.skadnetwork",
            "uw77j35x4d.skadnetwork",
            "pwa73g5rt2.skadnetwork",
            "578prtvx9j.skadnetwork",
            "4dzt52r2t5.skadnetwork",
            "tl55sbb4fm.skadnetwork",
            "e5fvkxwrpn.skadnetwork",
            "8c4e2ghe7u.skadnetwork",
            "3rd42ekr43.skadnetwork",
            "3qcr597p9d.skadnetwork"
          ]
        }
      ]
    ],
    extra: {
      eas: {
        projectId: process.env.PROJECT_ID
      },
      // axiosClient
      API_BASE_URL: process.env.API_BASE_URL,
      API_KEY_INI: process.env.API_KEY_INI,
      // googleLogin
      GOOGLE_OAUTH_CLIANT_ID: process.env.GOOGLE_OAUTH_CLIANT_ID,
      GOOGLE_OAUTH_CLIANT_ID_ANDROID: process.env.GOOGLE_OAUTH_CLIANT_ID_ANDROID,
      GOOGLE_OAUTH_CLIANT_ID_IOS: process.env.GOOGLE_OAUTH_CLIANT_ID_IOS,
      GOOGLE_OAUTH_CLIANT_ID_WEB: process.env.GOOGLE_OAUTH_CLIANT_ID_WEB,
      // 広告関連
      REWARDED_ANDROID_UNIT_ID: process.env.REWARDED_ANDROID_UNIT_ID,
      REWARDED_IOS_UNIT_ID: process.env.REWARDED_IOS_UNIT_ID,
      BANNER_ANDROID_UNIT_ID: process.env.BANNER_ANDROID_UNIT_ID,
      BANNER_IOS_UNIT_ID: process.env.BANNER_IOS_UNIT_ID,
      INTERSTITIAL_ANDROID_UNIT_ID: process.env.INTERSTITIAL_ANDROID_UNIT_ID,
      INTERSTITIAL_IOS_UNIT_ID: process.env.INTERSTITIAL_IOS_UNIT_ID
    }
  }
}
