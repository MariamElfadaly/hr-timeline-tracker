export const strings = {
  en: {
    appName: "Timeline",
    login: "Sign in",
    email: "Email",
    password: "Password",
    signIn: "Sign in",
    signOut: "Sign out",
    loginError: "Couldn't sign in. Check your email and password.",

    employees: "Employees",
    searchPlaceholder: "Search by name or job title",
    allStatuses: "All statuses",
    addEmployee: "Add employee",
    noEmployees: "No employees yet",
    noEmployeesHint: "Add your first employee to start tracking their journey.",
    noResults: "No employees match your search.",

    statusActive: "Active",
    statusProbation: "Probation",
    statusActionRequired: "Action required",
    statusEnded: "Ended",

    atCompany: "At the company",
    daysRemaining: "days remaining",
    dayOf: "Day {completed} of {total}",

    // Add employee form
    newEmployee: "New employee",
    fullName: "Full name",
    employeeId: "Employee ID",
    jobTitle: "Job title",
    joiningDate: "Joining date",
    phoneNumber: "Phone number",
    probationPeriod: "Probation period",
    oneMonth: "1 month",
    twoMonth: "2 month",
    threeMonths: "3 months",
    sixMonths: "6 months",
    custom: "Custom",
    customEndDate: "Custom end date",
    department: "Department",
    emailOptional: "Email",
    manager: "Manager / Supervisor",
    save: "Save employee",
    saving: "Saving…",
    cancel: "Cancel",
    requiredField: "Required",

    years: "Years",
    year: "Year",
    months: "Months",
    month: "Month",
    days: "Days",
    day: "Day",

    backToList: "Back to list",
    profile: "Profile",

    genericError: "Something went wrong. Please try again.",
  },
  ar: {
    appName: "تايملاين",
    login: "تسجيل الدخول",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    signIn: "تسجيل الدخول",
    signOut: "تسجيل الخروج",
    loginError: "تعذر تسجيل الدخول. تأكدي من البريد الإلكتروني وكلمة المرور.",

    employees: "الموظفون",
    searchPlaceholder: "ابحث بالاسم أو الوظيفة",
    allStatuses: "كل الحالات",
    addEmployee: "إضافة موظف",
    noEmployees: "لا يوجد موظفون بعد",
    noEmployeesHint: "أضيفي أول موظف لبدء تتبّع رحلته الوظيفية.",
    noResults: "لا يوجد موظفون مطابقون لبحثك.",

    statusActive: "نشط",
    statusProbation: "تحت الاختبار",
    statusActionRequired: "يتطلب إجراء",
    statusEnded: "منتهي",

    atCompany: "في الشركة",
    daysRemaining: "يوم متبقي",
    dayOf: "اليوم {completed} من {total}",

    newEmployee: "موظف جديد",
    fullName: "الاسم الكامل",
    employeeId: "الرقم الوظيفي",
    jobTitle: "المسمى الوظيفي",
    joiningDate: "تاريخ الالتحاق",
    phoneNumber: "رقم الهاتف",
    probationPeriod: "فترة الاختبار",
    oneMonth: "شهر واحد",
    twoMonth: "شهر 2",
    threeMonths: "3 أشهر",
    sixMonths: "6 أشهر",
    custom: "مخصص",
    customEndDate: "تاريخ انتهاء مخصص",
    department: "القسم",
    emailOptional: "البريد الإلكتروني",
    manager: "المدير المباشر",
    save: "حفظ الموظف",
    saving: "جارٍ الحفظ…",
    cancel: "إلغاء",
    requiredField: "مطلوب",

    years: "سنوات",
    year: "سنة",
    months: "أشهر",
    month: "شهر",
    days: "أيام",
    day: "يوم",

    backToList: "العودة للقائمة",
    profile: "الملف الشخصي",

    genericError: "حدث خطأ ما. حاولي مرة أخرى.",
  },
};

export function t(lang, key, vars = {}) {
  let str = strings[lang]?.[key] ?? strings.en[key] ?? key;
  Object.entries(vars).forEach(([k, v]) => {
    str = str.replace(`{${k}}`, v);
  });
  return str;
}
