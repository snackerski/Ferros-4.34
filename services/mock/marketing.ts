
import { ClientProfile, LoyaltyMember, LoyaltyTransaction, Survey, SurveyFeedback, SpecialOffer, WebAccount, AbandonedCart, WebAffiliate, LoyaltyTier } from '../../types';

export const MOCK_CLIENT: ClientProfile = { 
  id: 'CLI-001', 
  firstName: 'Maciej', 
  lastName: 'Fiszer', 
  email: 'maciej.fiszer@example.com', 
  phone: '+48 600', 
  points: 2450, 
  bookings: ['RES-EX-SAMPLE', 'RES-10293', 'RES-W001', 'RES-W002'], 
  tier: LoyaltyTier.GOLD 
};

export const MOCK_LOYALTY_MEMBERS: LoyaltyMember[] = [{ id: 'MEM-1', firstName: 'Maciej', lastName: 'Fiszer', cardNumber: 'FC-10001', email: 'maciej.fiszer@example.com', joinDate: '2021-05-10', pointsBalance: 2450, tier: LoyaltyTier.GOLD }];
export const MOCK_LOYALTY_TRANSACTIONS: LoyaltyTransaction[] = [{ id: 'LT-1', memberId: 'MEM-1', date: '2023-10-20', type: 'EARN', description: 'Rezerwacja R001', points: 150 }];
export const MOCK_SURVEYS: Survey[] = [{ id: 'SUR-1', title: 'Satysfakcja (Lato 2023)', targetGroup: 'PAX R001', npsScore: 65, responseCount: 450 }];
export const MOCK_SURVEY_FEEDBACK: SurveyFeedback[] = [{ id: 'FB-1', surveyId: 'SUR-1', score: 10, comment: 'Super rejs.', passengerName: 'Anna Nowak', date: '2023-10-24' }];
export const MOCK_SPECIAL_OFFERS: SpecialOffer[] = [{ id: 'OFF-1', title: 'Szwecja w jeden dzień', description: 'Rejs w obie strony w super cenie', discountCode: 'ONEDAY', imageColor: 'bg-blue-500' }];
export const MOCK_WEB_ACCOUNTS: WebAccount[] = [{ id: 'WEB-1', email: 'maciej.fiszer@example.com', status: 'ACTIVE', lastLogin: '2023-10-25 10:00', failedLoginAttempts: 0, linkedClientId: 'CLI-001' }];
export const MOCK_ABANDONED_CARTS: AbandonedCart[] = [{ id: 'CART-1', date: '2023-10-25 09:00', customerEmail: 'jan@example.com', routeId: 'R001', value: 450, status: 'NEW', recoveryEmailSent: false }];
export const MOCK_WEB_AFFILIATES: WebAffiliate[] = [{ id: 'AFF-1', name: 'SzwecjaBlog.pl', referralCode: 'SZWECJA10', visits: 1500, conversions: 45, commissionEarned: 1200 }];
