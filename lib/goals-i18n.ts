// ─── Arabic display strings for the donation goals ─────────────────────────
// English lives in lib/goals.ts and MUST stay English — it feeds Stripe product
// labels and metadata. This file only provides the Arabic *display* copy, keyed
// by GoalId, plus per-part (bundle breakdown) titles and notes. Components pick
// the Arabic version when lang === "ar"; otherwise they use the English from
// lib/goals.ts. Figures (A$ amounts, counts) are never translated.

import type { GoalId } from "@/lib/goals";

export interface GoalArText {
  title: string;
  short: string;
  description: string;
  unitLabel?: string;
  imageAlt?: string;
  parts?: Record<string, { title: string; note: string }>;
}

export const GOAL_AR: Record<GoalId, GoalArText> = {
  "solar-system": {
    title: "نظام الطاقة الشمسية",
    short:
      "طاقة شمسية لتشغيل مضخة المياه وجلب الإنارة والكهرباء إلى المركز بأكمله.",
    description:
      "نظام طاقة شمسية متكامل لتشغيل مضخة المياه العميقة وجلب إنارة وكهرباء موثوقة أخيرًا إلى الملجأ — الفصول الدراسية والمهاجع والمطبخ والعيادة. وهي الخطوة الأكبر نحو جعل المركز مكتفيًا ذاتيًا.",
    unitLabel: undefined,
    imageAlt: "ملجأ كاپويتا الذي سيشغّله نظام الطاقة الشمسية",
    parts: {
      panels: {
        title: "مصفوفة الألواح الشمسية",
        note: "الألواح نفسها — مصمّمة لتشغيل المضخة والمركز.",
      },
      batteries: {
        title: "بنك تخزين البطاريات",
        note: "يخزّن الطاقة لتبقى الأنوار مضاءة بعد غروب الشمس.",
      },
      inverter: {
        title: "العاكس ومنظّم الشحن",
        note: "يحوّل الطاقة وينظّمها بأمان للاستخدام اليومي.",
      },
      wiring: {
        title: "الأسلاك والإنارة والتوزيع",
        note: "كابلات وتجهيزات لإيصال الطاقة إلى الموقع بأكمله.",
      },
      install: {
        title: "التركيب والتثبيت",
        note: "الهياكل والتثبيت والعمالة اللازمة لتركيب النظام كاملًا.",
      },
    },
  },
  "chicken-coop": {
    title: "حظيرة الدجاج و200 كتكوت",
    short:
      "حظيرة و200 كتكوت — بيض يومي للأطفال ودخل صغير ومستقر.",
    description:
      "حظيرة آمنة من الحيوانات المفترسة مزوّدة بـ200 كتكوت. ومع نموّها توفّر بيضًا يوميًا لوجبات الأطفال وفائضًا للبيع — لتحوّل هديةً لمرة واحدة إلى غذاء ودخل يتجدّدان كل يوم.",
    imageAlt: "أطفال أثناء وجبة في ملجأ كاپويتا",
    parts: {
      coop: {
        title: "هيكل الحظيرة والتسييج الواقي من المفترسات",
        note: "مأوى متين آمن من الحيوانات المفترسة للقطيع.",
      },
      chicks: {
        title: "200 كتكوت",
        note: "الطيور التي ستضع البيض.",
      },
      feed: {
        title: "العلف — أوّل 3 أشهر",
        note: "علف يكفي لتربية الكتاكيت حتى سنّ وضع البيض.",
      },
      equipment: {
        title: "المعالف والمساقي والمعدّات",
        note: "كل ما يلزم للحفاظ على صحة القطيع.",
      },
    },
  },
  "water-pump": {
    title: "مضخة المياه",
    short:
      "مضخة كهربائية لسحب المياه من البئر العميقة المحفورة في الموقع بالفعل.",
    description:
      "البئر العميقة محفورة بالفعل. ستقوم مضخة كهربائية — تعمل بنظام الطاقة الشمسية الجديد — بسحب مياه نظيفة للشرب والطهي والغسيل والحدائق، منهيةً النقل اليومي للمياه باليد.",
    imageAlt: "طفلة عند مضخة المياه في كاپويتا",
  },
  "ongoing-operations": {
    title: "النفقات التشغيلية المستمرة",
    short:
      "التشغيل اليومي للملجأ — الموظفون والطعام والرسوم المدرسية والرعاية الطبية.",
    description:
      "مخصّصات للمشرفة والمبشّر والقائم على رعاية الألبان؛ والرسوم المدرسية والزيّ المدرسي؛ والطعام والرعاية الطبية والتكاليف اليومية لإدارة دار للأطفال. الدعم الثابت الذي يُبقي الأبواب مفتوحة طوال العام.",
    unitLabel: "A$45,000 / سنويًا",
    imageAlt: "أطفال بالزيّ المدرسي في ملجأ كاپويتا",
  },
  "sponsor-a-child": {
    title: "اكفل طفلاً",
    short:
      "A$600 تغطّي سنةً كاملة لطفل واحد — وجبات ومأوى وتعليم وانتماء.",
    description:
      "A$600 تغطّي سنةً كاملة لطفل واحد: وجبات وسرير آمن وتعليم وكرامة الانتماء. من بين 70 طفلاً في رعايتنا، 10 مكفولون بالفعل — و60 ما زالوا في الانتظار. اكفل ما شئت منهم.",
    unitLabel: "A$600 / للطفل / سنويًا",
    imageAlt: "أطفال في ملجأ كاپويتا للأطفال",
  },
};
