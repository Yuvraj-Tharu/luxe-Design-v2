// export type User = {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   created_date: string;
// };

// export type Inquiry = {
//   id?: string;
//   service: string;
//   questions: {
//     question: string;
//     type: string;
//     options?: string[];
//   }[];
// };
// export type InquiryWithServiceName = Inquiry & {
//   serviceName: string;
//   serviceImage: string;
// };
// export type Blog = {
//   id: string;
//   title: string;
//   // author: string;
//   image: string;
//   caroselImages: string[] | null;
//   description: string;
//   metaTitle: string;
//   metaDescription: string;
//   metaKeywords: string[];
//   ogTitle: string;
//   ogDescription: string;
//   created_date: string;
//   category: string;
// };

// export type Project = {
//   id: string;
//   name: string;
//   description: string;
// };

// export type Testimonials = {
//   id: string;
//   image: string;
//   name: string;
//   position: string;
//   description: string;
//   metaTitle: string;
//   metaDescription: string;
//   metaKeywords: string[];
//   ogTitle: string;
//   ogDescription: string;
// };

// export type Authority = {
//   id: string;
//   name: string;
//   image: string;
//   description: string;
// };

// export type Appointment = {
//   id: string;
//   name: string;
//   phone: string;
//   service: string;
//   project: string;
//   location: string;
//   moreAboutProject: string;
//   date: string;
//   status: "pending" | "approved";
// };
// export type Application = {
//   id?: string;
//   name: string;
//   phone_no: string;
//   email: string;
//   address: string;
//   notes_about_you: string;
//   terms: boolean;
//   resume: string;
//   title: string;
// };
// export type AboutUs = {
//   id: string;
//   chairmanImage: string;
//   mission: string;
//   vision: string;
//   goal: string;
//   missionPoints: string[] | [];
//   visionPoints: string[] | [];
//   goalPoints: string[] | [];
//   goalImage: string;
//   missionImage: string;
//   visionImage: string;
//   messageFromChairman: string;
//   chairmanDesignation: string;
//   futureOfDubaiApprovalImages: string[] | null;
//   companyName: string;
//   futureOfDubaiApprovalText: string;
//   metaTitle: string;
//   metaDescription: string;
//   metaKeywords: string[];
//   ogTitle: string;
//   ogDescription: string;
// };

// export type Home = {
//   id: string;
//   dubaiApprovalService: {
//     title: string;
//     subtitle: string;
//     description: string;
//   };
//   approvalPartner: {
//     title: string;
//     subtitle: string;
//     description: string;
//     stats: {
//       satisfiedCustomers: number;
//       yearsExperience: number;
//     };
//   };
//   whoWeAre: {
//     title: string;
//     subtitle: string;
//     description: string;
//   };
//   seo: {
//     metaKeywords: string[];
//     ogTitle: string;
//   };
//   approvalPartnerImage: string;
//   whoWeAreImages: string[] | null;
// };

// export type OrganizationSettings = {
//   id: string;
//   phone_no: string;
//   location: string;
//   email: string;
//   copy_right: string;
//   opening_hours: string;
//   social_media: {
//     facebook: string;
//     youtube: string;
//     instagram: string;
//     linkedin: string;
//   };
//   opening_days: string;
//   header_logo: string;
//   footer_logo: string;
// };

// export type Vacancy = {
//   id?: string;
//   title: string;
//   location: string;
//   department: string;
//   description: string;
//   employment_type: "Full-time" | "Part-time" | "Contract" | "Internship";
//   experience_level: "Entry-level" | "Mid-level" | "Senior-level";
//   seats: number;
//   salary_range: string;
//   application_deadline: string; // Or Date if you're handling it as a Date object
// };
