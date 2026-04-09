export interface Section5Data {
  useFlatRate: boolean
  rates: {
    constructionPermit: number  // אגרות בנייה ₪/מ"ר         default: 37.65
    roadLand: number            // היטל כביש - קרקע ₪/מ"ר    default: 82.51
    roadBuilding: number        // היטל כביש - בנייה ₪/מ"ר   default: 118.28
    sidewalkLand: number        // היטל מדרכה - קרקע ₪/מ"ר   default: 67.51
    sidewalkBuilding: number    // היטל מדרכה - בנייה ₪/מ"ר  default: 96.77
    drainageLand: number        // היטל תיעול - קרקע ₪/מ"ר   default: 32.08
    drainageBuilding: number    // היטל תיעול - בנייה ₪/מ"ר  default: 57.53
    waterAuthority: number      // דמי הקמה תאגיד מים ₪/מ"ר  default: 94.19
    safetyBuffer: number        // מקדם בטחון %               default: 6
  }
}
