const SettingGeneral = require("../../models/settings-general.model")

const systemConfig = require("../../config/system")

//[GET] admin/settings/general
module.exports.general = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({})

    res.render("admin/page/settings/general", {
        pageTitle: "Cài đặt chung",
        settingGeneral: settingGeneral
    })
}

//[PATCH] admin/settings/general
module.exports.generalPatch = async (req, res) => {
    try {
        const settingGeneral = await SettingGeneral.findOne({})

        if (settingGeneral) {
            await SettingGeneral.updateMany({
                _id: settingGeneral.id
            }, req.body)
        } else {
            const record = new SettingGeneral(req.body)
            record.save()
        }

        req.flash("success", "Cập nhật cài đặt thành công!")
        res.redirect("back")
    } catch (e) {
        req.flash("error", "Cập nhật cài đặt chung thất bại!")
        res.redirect("back")
    }
}