import { PricingRuleModel } from "@/lib/server/models/PricingRule";

export const DEFAULT_RULE_VERSION = "VEYLO-MVP-RULES-v1";

export async function getActivePricingRule() {
  const activeRule = await PricingRuleModel.findOne({ active: true }).sort({
    createdAt: -1,
  });

  if (activeRule) {
    return activeRule;
  }

  return PricingRuleModel.create({
    ruleVersion: DEFAULT_RULE_VERSION,
    baseFare: 900,
    distanceRate: 190,
    timeRate: 55,
    packageHandlingFees: {
      default: 250,
      document: 200,
      fragile: 650,
      food: 300,
      highValue: 650,
    },
    urgencyMultipliers: {
      STANDARD: 1,
      EXPRESS: 1.35,
      SCHEDULED: 1.1,
    },
    zoneDifficultyRules: {
      standard: 150,
      longRoute: 350,
    },
    fareFloor: 1200,
    fareCap: 8500,
    surchargeCap: 1800,
    discountCap: 700,
    quoteExpiryMinutes: 8,
    active: true,
  });
}
