import { FeatureModel } from "../models/feature";

export class FeatureService {
  private features: FeatureModel[] = [
    {
      _id: 1,
      geometry: {
        coordinates: [-8.4504292, 39.4670766],
        type: "Point",
      },
      properties: {
        title: "Boa, mexican",
        body: "In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt.",
        address: "05 Meadow Ridge Lane",
      },
    },
    {
      _id: 2,
      geometry: {
        coordinates: [123.6231723, -10.344067],
        type: "Point",
      },
      properties: {
        title: "Gecko, ring-tailed",
        body: "Proin risus.",
        address: "12 Fuller Place",
      },
    },
    {
      _id: 3,
      geometry: { coordinates: [169.2803499, -19.54172], type: "Point" },
      properties: {
        title: "Waterbuck, common",
        body: "Nam nulla.",
        address: "35984 Vidon Circle",
      },
    },
    {
      _id: 4,
      geometry: { coordinates: [43.394005, -11.4749128], type: "Point" },
      properties: {
        title: "Koala",
        body: "Suspendisse potenti. In eleifend quam a odio.",
        address: "6784 Magdeline Center",
      },
    },
    {
      _id: 5,
      geometry: { coordinates: [23.50527, -33.29717], type: "Point" },
      properties: {
        title: "Buttermilk snake",
        body: "Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa.",
        address: "265 Artisan Park",
      },
    },
    {
      _id: 6,
      geometry: { coordinates: [124.048453, 41.821778], type: "Point" },
      properties: {
        title: "Toddy cat",
        body: "Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros.",
        address: "6 Merchant Point",
      },
    },
    {
      _id: 7,
      geometry: { coordinates: [101.803717, 36.599744], type: "Point" },
      properties: {
        title: "Wapiti, elk,",
        body: "Donec dapibus. Duis at velit eu est congue elementum.",
        address: "98569 Monument Junction",
      },
    },
    {
      _id: 8,
      geometry: { coordinates: [101.2750531, 14.0899827], type: "Point" },
      properties: {
        title: "Gull, southern black-backed",
        body: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est.",
        address: "79051 Transport Center",
      },
    },
    {
      _id: 9,
      geometry: { coordinates: [121.1174238, 30.1787074], type: "Point" },
      properties: {
        title: "Eurasian beaver",
        body: "Integer ac leo.",
        address: "608 Bay Way",
      },
    },
    {
      _id: 10,
      geometry: { coordinates: [106.8030892, -6.6409658], type: "Point" },
      properties: {
        title: "Red-winged hawk (unidentified)",
        body: "Mauris ullamcorper purus sit amet nulla.",
        address: "1 Pierstorff Center",
      },
    },
    {
      _id: 11,
      geometry: { coordinates: [106.9093, -6.334631], type: "Point" },
      properties: {
        title: "Frog (unidentified)",
        body: "In eleifend quam a odio. In hac habitasse platea dictumst.",
        address: "28 Waxwing Hill",
      },
    },
    {
      _id: 12,
      geometry: { coordinates: [115.299029, 28.391349], type: "Point" },
      properties: {
        title: "Steenbuck",
        body: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio.",
        address: "07 Alpine Trail",
      },
    },
    {
      _id: 13,
      geometry: { coordinates: [-73.7316825, 45.5734042], type: "Point" },
      properties: {
        title: "Raccoon, crab-eating",
        body: "In hac habitasse platea dictumst.",
        address: "96086 Marcy Drive",
      },
    },
    {
      _id: 14,
      geometry: { coordinates: [-77.3439283, 1.2296124], type: "Point" },
      properties: {
        title: "Sacred ibis",
        body: "Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.",
        address: "60 Linden Plaza",
      },
    },
    {
      _id: 15,
      geometry: { coordinates: [23.2517507, 42.6687933], type: "Point" },
      properties: {
        title: "Rat, white-faced tree",
        body: "Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum.",
        address: "18 Fair Oaks Lane",
      },
    },
    {
      _id: 16,
      geometry: { coordinates: [112.837815, 22.060541], type: "Point" },
      properties: {
        title: "Capuchin, brown",
        body: "Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis.",
        address: "215 Grasskamp Circle",
      },
    },
    {
      _id: 17,
      geometry: { coordinates: [105.1171246, 20.3814569], type: "Point" },
      properties: {
        title: "Coke's hartebeest",
        body: "Maecenas pulvinar lobortis est. Phasellus sit amet erat.",
        address: "073 Oxford Junction",
      },
    },
    {
      _id: 18,
      geometry: { coordinates: [-8.2776432, 41.4821084], type: "Point" },
      properties: {
        title: "Duiker, common",
        body: "Etiam justo.",
        address: "7 3rd Park",
      },
    },
    {
      _id: 19,
      geometry: { coordinates: [105.6259, -6.7267], type: "Point" },
      properties: {
        title: "Cormorant, flightless",
        body: "Morbi ut odio. Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo.",
        address: "5 Corry Hill",
      },
    },
    {
      _id: 20,
      geometry: { coordinates: [-40.1526661, -4.3253636], type: "Point" },
      properties: {
        title: "Gecko, barking",
        body: "Etiam pretium iaculis justo.",
        address: "72464 Arizona Lane",
      },
    },
  ];

  static getInstance(): FeatureService {
    return FeatureService._instance;
  }

  private static _instance: FeatureService = new FeatureService();

  getFeatures(): FeatureModel[] {
    return this.features;
  }

  getFeatureById(id: number): FeatureModel | undefined {
    return this.features.find((feature) => feature.id === id) || undefined;
  }
}
