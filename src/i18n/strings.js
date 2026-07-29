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

    // Phase 2: probation decisions
    actionRequired: "Action required",
    actionRequiredDesc: "This employee's probation period has ended. Choose how to proceed.",
    confirmEmployee: "Confirm Employee",
    extendProbation: "Extend Probation",
    scheduleReview: "Schedule a Review",
    endEmployment: "End Employment",
    confirmEmployeePrompt: "This will confirm the employee and start their post-probation checklist.",
    extendProbationPrompt: "Current probation end date: {date}. Choose a new end date.",
    twoWeeks: "2 weeks",
    newProbationEnd: "New end date: {date}",
    noteOptional: "Note (optional)",
    scheduleReviewPrompt: "Set a date to revisit this decision. The employee stays flagged as needing action until then.",
    reviewDate: "Review date",
    endEmploymentPrompt: "This will mark the employee as ended. This can't be easily undone.",
    endDate: "End date",
    reasonOptional: "Reason (optional)",
    statusReviewScheduled: "Review scheduled",
    probationHistory: "Probation history",
    extendedOn: "Extended on {date} → new end date {newDate}",

    // Reminders
    reminders: "Reminders",
    noReminders: "Nothing needs your attention right now.",
    reminderReviewScheduled: "Review scheduled for {date}",
    reminderActionRequired: "Probation ended — decision needed",
    reminderProbationEndsIn: "Probation ends in {days} days",
    reminderProbationDecideSoon: "Probation ends in {days} days — decide soon",
    reminderProbationDecideToday: "Probation ends today — a decision is needed",
    decideSoonShort: "Decide within {days}d",
    reminderChecklistMissing: "Missing: {items}",

    // Checklist
    postProbationChecklist: "Post-probation checklist",
    checklistComplete: "Complete",
    checklistIncomplete: "Incomplete",
    employeeIdItem: "Employee ID issued",
    idNumber: "ID number",
    uniform: "Uniform",
    uniformNotRequired: "Not required",
    required: "Required",
    uniformType: "Type",
    quantity: "Quantity",
    size: "Size",
    locker: "Locker",
    lockerNumber: "Locker number",
    payrollCard: "Payroll card issued",
    empFile: "EMP FILE completed",

    // Phase 3: Timeline
    employeeTimeline: "Timeline",
    timelineJoined: "Joined the company",
    timelineProbationStart: "Probation started",
    timelineProbationEnd: "Probation ends",
    timelineConfirmed: "Confirmed as employee",
    timelineEnded: "Employment ended",
    timelineExtended: "Probation extended → {date}",
    timelineReviewScheduled: "Scheduled review",
    timelineIdIssued: "Employee ID issued",
    timelineUniformProvided: "Uniform provided",
    timelineLockerAssigned: "Locker assigned",
    timelinePayrollCard: "Payroll card issued",
    timelineEmpFile: "EMP FILE completed",
    timeline_3_months: "3-month milestone",
    timeline_6_months: "6-month milestone",
    timelineYearAnniversary: "{years}-year anniversary",

    // Phase 3: Custom milestones
    customMilestones: "Custom milestones",
    addMilestone: "Add milestone",
    noMilestones: "No custom milestones yet.",
    milestoneType: "Milestone type",
    milestoneLabel: "Milestone name",
    milestoneDate: "Date",
    remindMeBefore: "Remind me",
    onTheDay: "On the day",
    daysBefore: "{days}d before",
    milestoneType_contract_expiry: "Contract expiry",
    milestoneType_contract_renewal: "Contract renewal",
    milestoneType_performance_review: "Performance review",
    milestoneType_salary_review: "Salary review",
    milestoneType_training_renewal: "Training renewal",
    milestoneType_certification_expiry: "Certification expiry",
    milestoneType_medical_exam_renewal: "Medical examination renewal",
    milestoneType_equipment_renewal: "Company equipment renewal",
    milestoneType_other: "Other",
    reminderMilestoneToday: "{label} is today",
    reminderMilestoneIn: "{label} in {days} days",

    // Delete
    deleteEmployee: "Delete this employee",
    deleteEmployeePrompt: "Permanently delete {name}? This can't be undone.",
    deleteConfirm: "Yes, delete",

    // Edit
    editEmployee: "Edit",
    editEmployeeHint: "Joining date and probation aren't editable here — use Extend/Confirm/End on the profile for those.",
    backToProfile: "Back to profile",

    // Print
    print: "Print",

    // Notes
    notes: "Notes",
    notesPlaceholder: "Any comments about this employee…",
    notesUnsavedHint: "Saves when you click away",

    // Early confirm
    confirmEarly: "Confirm employee now",
    confirmEarlyPrompt: "Confirm this employee before probation ends? This will start their post-probation checklist immediately.",

    // Reminders dismiss
    dismiss: "Mark as done",

    // Timeline collapse
    timelineShowMore: "Show {count} more",
    timelineShowLess: "Show less",

    // Reports
    reports: "Reports",
    totalEmployees: "Total employees",
    reportProbationEndingSoon: "Probation ending within 30 days",
    reportIncompleteChecklists: "Incomplete checklists",
    reportUpcomingMilestones: "Milestones in the next 30 days",
    reportNoneFound: "Nothing here.",
    daysRemainingCount: "{days} days remaining",

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

    // Phase 2: probation decisions
    actionRequired: "يتطلب إجراء",
    actionRequiredDesc: "انتهت فترة اختبار هذا الموظف. اختاري كيفية المتابعة.",
    confirmEmployee: "تثبيت الموظف",
    extendProbation: "تمديد فترة الاختبار",
    scheduleReview: "جدولة مراجعة",
    endEmployment: "إنهاء التوظيف",
    confirmEmployeePrompt: "سيتم تثبيت الموظف وبدء قائمة ما بعد الاختبار الخاصة به.",
    extendProbationPrompt: "تاريخ انتهاء الاختبار الحالي: {date}. اختاري تاريخ انتهاء جديد.",
    twoWeeks: "أسبوعان",
    newProbationEnd: "تاريخ الانتهاء الجديد: {date}",
    noteOptional: "ملاحظة (اختياري)",
    scheduleReviewPrompt: "حددي تاريخًا لإعادة النظر في هذا القرار. سيبقى الموظف مُعلَّمًا كحالة تتطلب إجراء حتى ذلك الحين.",
    reviewDate: "تاريخ المراجعة",
    endEmploymentPrompt: "سيتم تعليم الموظف كمنتهي الخدمة. لا يمكن التراجع عن هذا بسهولة.",
    endDate: "تاريخ الانتهاء",
    reasonOptional: "السبب (اختياري)",
    statusReviewScheduled: "تمت جدولة مراجعة",
    probationHistory: "سجل فترة الاختبار",
    extendedOn: "تم التمديد في {date} ← تاريخ الانتهاء الجديد {newDate}",

    // Reminders
    reminders: "التذكيرات",
    noReminders: "لا يوجد ما يتطلب انتباهك الآن.",
    reminderReviewScheduled: "المراجعة مجدولة بتاريخ {date}",
    reminderActionRequired: "انتهت فترة الاختبار — القرار مطلوب",
    reminderProbationEndsIn: "تنتهي فترة الاختبار خلال {days} يوم",
    reminderProbationDecideSoon: "تنتهي فترة الاختبار خلال {days} يوم — يُرجى اتخاذ القرار قريبًا",
    reminderProbationDecideToday: "تنتهي فترة الاختبار اليوم — يجب اتخاذ القرار",
    decideSoonShort: "القرار خلال {days} يوم",
    reminderChecklistMissing: "ناقص: {items}",

    // Checklist
    postProbationChecklist: "قائمة ما بعد الاختبار",
    checklistComplete: "مكتملة",
    checklistIncomplete: "غير مكتملة",
    employeeIdItem: "تم إصدار البطاقة الوظيفية",
    idNumber: "رقم البطاقة",
    uniform: "الزي الموحد",
    uniformNotRequired: "غير مطلوب",
    required: "مطلوب",
    uniformType: "النوع",
    quantity: "الكمية",
    size: "المقاس",
    locker: "الخزانة",
    lockerNumber: "رقم الخزانة",
    payrollCard: "تم إصدار بطاقة الراتب",
    empFile: "اكتمل الملف الوظيفي (EMP FILE)",

    // Phase 3: Timeline
    employeeTimeline: "الخط الزمني",
    timelineJoined: "التحق بالشركة",
    timelineProbationStart: "بدأت فترة الاختبار",
    timelineProbationEnd: "تنتهي فترة الاختبار",
    timelineConfirmed: "تم تثبيته كموظف",
    timelineEnded: "انتهى التوظيف",
    timelineExtended: "تم تمديد الاختبار ← {date}",
    timelineReviewScheduled: "مراجعة مجدولة",
    timelineIdIssued: "تم إصدار البطاقة الوظيفية",
    timelineUniformProvided: "تم توفير الزي الموحد",
    timelineLockerAssigned: "تم تخصيص الخزانة",
    timelinePayrollCard: "تم إصدار بطاقة الراتب",
    timelineEmpFile: "اكتمل الملف الوظيفي",
    timeline_3_months: "علامة الثلاثة أشهر",
    timeline_6_months: "علامة الستة أشهر",
    timelineYearAnniversary: "الذكرى السنوية ({years} سنة)",

    // Phase 3: Custom milestones
    customMilestones: "مواعيد مخصصة",
    addMilestone: "إضافة موعد",
    noMilestones: "لا توجد مواعيد مخصصة بعد.",
    milestoneType: "نوع الموعد",
    milestoneLabel: "اسم الموعد",
    milestoneDate: "التاريخ",
    remindMeBefore: "التذكير",
    onTheDay: "في نفس اليوم",
    daysBefore: "قبل {days} يوم",
    milestoneType_contract_expiry: "انتهاء العقد",
    milestoneType_contract_renewal: "تجديد العقد",
    milestoneType_performance_review: "تقييم الأداء",
    milestoneType_salary_review: "مراجعة الراتب",
    milestoneType_training_renewal: "تجديد التدريب",
    milestoneType_certification_expiry: "انتهاء الشهادة",
    milestoneType_medical_exam_renewal: "تجديد الفحص الطبي",
    milestoneType_equipment_renewal: "تجديد عهدة الشركة",
    milestoneType_other: "أخرى",
    reminderMilestoneToday: "{label} اليوم",
    reminderMilestoneIn: "{label} خلال {days} يوم",

    // Delete
    deleteEmployee: "حذف هذا الموظف",
    deleteEmployeePrompt: "هل تريدين حذف {name} نهائيًا؟ لا يمكن التراجع عن هذا الإجراء.",
    deleteConfirm: "نعم، احذف",

    // Edit
    editEmployee: "تعديل",
    editEmployeeHint: "تاريخ الالتحاق وفترة الاختبار غير قابلين للتعديل هنا — استخدمي أزرار التمديد/التثبيت/الإنهاء في الملف الشخصي لذلك.",
    backToProfile: "العودة للملف الشخصي",

    // Print
    print: "طباعة",

    // Notes
    notes: "ملاحظات",
    notesPlaceholder: "أي تعليقات حول هذا الموظف…",
    notesUnsavedHint: "يتم الحفظ عند الانتقال بعيدًا",

    // Early confirm
    confirmEarly: "تثبيت الموظف الآن",
    confirmEarlyPrompt: "هل تريدين تثبيت هذا الموظف قبل انتهاء فترة الاختبار؟ سيؤدي هذا لبدء قائمة ما بعد الاختبار فورًا.",

    // Reminders dismiss
    dismiss: "تمييز كمكتمل",

    // Timeline collapse
    timelineShowMore: "عرض {count} أخرى",
    timelineShowLess: "عرض أقل",

    // Reports
    reports: "التقارير",
    totalEmployees: "إجمالي الموظفين",
    reportProbationEndingSoon: "فترات اختبار تنتهي خلال 30 يومًا",
    reportIncompleteChecklists: "قوائم غير مكتملة",
    reportUpcomingMilestones: "مواعيد خلال 30 يومًا القادمة",
    reportNoneFound: "لا يوجد شيء هنا.",
    daysRemainingCount: "{days} يوم متبقي",

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
