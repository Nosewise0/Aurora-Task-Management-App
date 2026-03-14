module.exports.redirectToProfile = (req, res) => {
    res.redirect("/settings/profile");
};

module.exports.renderProfile = (req, res) => {
    res.render("settings", { section: "profile" });
};

module.exports.renderNotifications = (req, res) => {
    res.render("settings", { section: "notifications" });
};

module.exports.renderSecurity = (req, res) => {
    res.render("settings", { section: "security" });
};

module.exports.renderAppearance = (req, res) => {
    res.render("settings", { section: "appearance" });
};

module.exports.renderBilling = (req, res) => {
    res.render("settings", { section: "billing" });
};
