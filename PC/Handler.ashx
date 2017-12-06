<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Web;
using Rtdl.Basic.Model;
using Rtdl.Basic.Data;
using Rtdl.Sms.Model;
using Rtdl.Sms.Data;
using LitJson;
using System.Collections.Generic;
using com.seascape.tools;

public class Handler : IHttpHandler {

    //分页大小
    public static int perPage = 10;
    public static adminUser admin = null;
    public static string BaseUrl = "http://sms.tyrtdl.cn/";
    
    public void ProcessRequest (HttpContext c) {
        int F = string.IsNullOrEmpty(c.Request["fn"]) ? 0 : Convert.ToInt16(c.Request["fn"]);
        AddQueryLog(c);
        c.Response.ContentType = "text/plain";
        if (F != 0 && F != 19)
        {
            admin = Comm.LoginCheck(c);
            if (admin != null)
            {
                string submitCheck = string.IsNullOrEmpty(c.Request["submitCheck"]) ? "" : c.Request["submitCheck"].ToString();
                if (submitCheck.Length == 0 || submitCheck.Length > 3)
                {
                    c.Response.Write(GetResult(F, c));
                }
                else
                {
                    new Main().AddTestLog("[A]Result" + F, "重复提交");
                    c.Response.Write(ToJsonResult.GetR(1, "System Exception[" + F + "]"));
                }
            }
            else
            {
                c.Response.Write(ToJsonResult.GetR(100, "登陆状态失效，请重新登录后再试"));
            }
        }
        else
        {
            c.Response.Write(GetResult(F, c));
        }
    }

   
    /// <summary>
    /// 功能导航
    /// </summary>
    /// <param name="f"></param>
    /// <returns></returns>
    public string GetResult(int f, HttpContext c)
    {
        string Result = ToJsonResult.GetR(1, "System Exception[" + f + "]");
        try
        {
            switch (f)
            {
                case 0:
                    Result = Login(c);//登陆
                    break;
                case 18:
                    Result = GetLimit(c);//获取菜单权限
                    break;
                case 19:
                    Result = LoginOut(c);//退出系统
                    break;
                case 26:
                    Result = GetSysLogList(c);//获取系统日志列表
                    break;
                case 90:
                    Result = UpdatePass(c);//修改密码
                    break;
                case 101:
                    Result = GetRoleList(c);//获取角色列表
                    break;
                case 102:
                    Result = User(c);//添加账户
                    break;
                case 103:
                    Result = GetAdminUserList(c);//获取账户列表
                    break;
                case 104:
                    Result = DelAdmin(c);//删除账户
                    break;
                case 105:
                    Result = DelRole(c);//删除角色
                    break;
                case 106:
                    Result = Role(c);//添加修改角色
                    break;
                case 107:
                    Result = GetLimitList(c);//获取权限列表
                    break;
                case 110:
                    Result = OperClass(c);//处理分类
                    break;
                case 111:
                    Result = DelClass(c);//删除分类
                    break;
                case 112:
                    Result = GetClassList(c);//获取分类列表
                    break;
                case 113:
                    Result = OperContact(c);//添加修改通讯录
                    break;
                case 114:
                    Result = GetAddressList(c);//获取通讯录列表
                    break;
                case 115:
                    Result = DelAddr(c);//删除通讯录用户
                    break;
                case 116:
                    Result = GetAddressForGroup(c);//获取指定分组人员明细
                    break;
                case 117:
                    Result = OperShort(c);//处理常用短语
                    break;
                case 118:
                    Result = GetShortList(c);//获取短语列表
                    break;
                case 119:
                    Result = DelShort(c);//删除常用短语
                    break;
                case 120:
                    Result = ImportHid(c);
                    break;
                case 121:
                    Result = ImportTxt(c);//导入txt文件
                    break;
                case 122:
                    Result = GetChannelList(c);//获取通道配置列表
                    break;
                case 123:
                    Result = SetChannel(c);//配置通道
                    break;
            }
        }
        catch(Exception e)
        {
            Result = e.Message.ToString();
        }
        new Main().AddTestLog("[A]Result"+f, Result);
        return Result;
    }

    /// <summary>
    /// 获取角色列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetRoleList(HttpContext c)
    {
        List<roleInfo> lo = new _AdminRole().GetRoleList();
        if (lo != null && lo.Count > 0)
        {
            var o = new { Return = 0, Msg = "", List = lo };
            return JsonMapper.ToJson(o);
        }
        return ToJsonResult.GetR(1, "");
    }

    /// <summary>
    /// 获取通道配置列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetChannelList(HttpContext c)
    {
        List<smsChannel> lo = new _SmsChannel().GetSmsChannelList("select * from tbl_channel where Enable = 0 order by addOn asc");
        if (lo != null && lo.Count > 0)
        {
            var o = new { Return = 0, Msg = "", List = lo };
            return JsonMapper.ToJson(o);
        }
        return ToJsonResult.GetR(1, "");
    }

    /// <summary>
    /// 导入备份通讯录
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string ImportHid(HttpContext c)
    {
        string fileName = string.IsNullOrEmpty(c.Request["fileName"]) ? "" : c.Request["fileName"].ToString();
        fileName = c.Server.MapPath(fileName);
        new Rtdl.Basic.Data.PlugIn._ImportHisData().ImportData(fileName, admin.ID);
        Log.AddAdminLog("", "导入通讯录", 0, admin.ID);
        return ToJsonResult.GetR(0, "");
    }

    /// <summary>
    /// 导入备份通讯录
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string ImportTxt(HttpContext c)
    {
        string fileName = string.IsNullOrEmpty(c.Request["fileName"]) ? "" : c.Request["fileName"].ToString();
        fileName = c.Server.MapPath(fileName);
        string smsTxt = System.IO.File.ReadAllText(fileName);
        smsTxt = smsTxt.Replace(",", "@");
        smsTxt = smsTxt.Replace("\r", "@");
        smsTxt = smsTxt.Replace("\n", "@");
        return ToJsonResult.GetR(0, smsTxt);
    }

    /// <summary>
    /// 获取分类列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetClassList(HttpContext c)
    {
        int parId = string.IsNullOrEmpty(c.Request["parId"]) ? 0 : Convert.ToInt16(c.Request["parId"]);
        List<classInfo> lo = new _Class().GetClassList(parId, admin.ID);
        if (lo != null && lo.Count > 0)
        {
            var o = new { Return = 0, Msg = "", List = lo };
            return JsonMapper.ToJson(o);
        }
        return ToJsonResult.GetR(1, "");
    }

    /// <summary>
    /// 删除分类
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string DelClass(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt16(c.Request["id"]);
        string Name = string.IsNullOrEmpty(c.Request["Name"]) ? "" : c.Request["Name"].ToString();
        Name = c.Server.UrlDecode(Name);
        if (id > 0)
        {
            var o = new
            {
                enable = -1
            };
            if (new Main().UpdateDb(o,"tbl_service_class", "id=" + id))
            {
                new Main().UpdateDb(o, "tbl_service_address", "ClassID=" + id);
                Log.AddAdminLog("", "删除分类:" + Name, 0,admin.ID);
                return ToJsonResult.GetR(0, "删除完成");
            }
        }
        return ToJsonResult.GetR(1, "删除失败，请重新登陆后再试");
    }


    /// <summary>
    /// 删除通讯录用户
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string DelAddr(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt16(c.Request["id"]);
        string Name = string.IsNullOrEmpty(c.Request["Name"]) ? "" : c.Request["Name"].ToString();
        Name = c.Server.UrlDecode(Name);
        if (id > 0)
        {
            var o = new
            {
                enable = -1
            };
            if (new Main().UpdateDb(o,"tbl_service_address", "id=" + id))
            {
                Log.AddAdminLog("", "删除通讯录用户:" + Name, 0,admin.ID);
                return ToJsonResult.GetR(0, "删除完成");
            }
        }
        return ToJsonResult.GetR(1, "删除失败，请重新登陆后再试");
    }
    
    /// <summary>
    /// 添加修改账户
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string User(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt16(c.Request["id"]);
        int pId = string.IsNullOrEmpty(c.Request["pId"]) ? 0 : Convert.ToInt16(c.Request["pId"]);
        int cId = string.IsNullOrEmpty(c.Request["cId"]) ? 0 : Convert.ToInt16(c.Request["cId"]);
        int role = string.IsNullOrEmpty(c.Request["role"]) ? 0 : Convert.ToInt16(c.Request["role"]);
        string uName = string.IsNullOrEmpty(c.Request["uName"]) ? "" : c.Request["uName"].ToString();
        string uPass = string.IsNullOrEmpty(c.Request["uPass"]) ? "" : c.Request["uPass"].ToString();
        string name = string.IsNullOrEmpty(c.Request["name"]) ? "" : c.Request["name"].ToString();
        string mobile = string.IsNullOrEmpty(c.Request["mobile"]) ? "" : c.Request["mobile"].ToString();
        string contact = string.IsNullOrEmpty(c.Request["contact"]) ? "" : c.Request["contact"].ToString();
        string memo = string.IsNullOrEmpty(c.Request["memo"]) ? "" : c.Request["memo"].ToString();
        name = c.Server.UrlDecode(name);
        if (id == 0)
        {
            if (new _AdminUser().CheckUser(uName) == 0)
            {
                adminUser p = new adminUser
                {
                    LoginName = uName,
                    CorpName = name,
                    LoginPass = BasicTool.MD5(uPass),
                    Mobile = mobile,
                    Memo = memo,
                    AddOn = DateTime.Now,
                    Account = 0,
                    RoleID = role,
                    Contact = contact
                };
                if (new Main().AddToDb(p, "tbl_admin_user"))
                {
                    Log.AddAdminLog("", "添加账户," + name,0,admin.ID);
                    return ToJsonResult.GetR(0, "添加完成");
                }
            }
            else
            {
                return ToJsonResult.GetR(1, "该登陆名称已存在，不能重复添加");
            }
        }
        else
        {
            if (new _AdminUser().CheckUser(uName) == 0 || new _AdminUser().CheckUser(uName) == id)
            {
                if (uPass.Length == 0)
                {
                    var o = new
                    {
                        LoginName = uName,
                        CorpName = name,
                        Mobile = mobile,
                        Memo = memo,
                        Account = 0,
                        RoleID = role,
                        Contact = contact
                    };
                    if (new Main().UpdateDb(o, "tbl_admin_user", "id=" + id))
                    {
                        Log.AddAdminLog("", "修改账户" + name,0,admin.ID);
                        return ToJsonResult.GetR(0, "修改完成");
                    }
                }
                else
                {
                    var o = new
                    {
                        LoginName = uName,
                        CorpName = name,
                        LoginPass = BasicTool.MD5(uPass),
                        Mobile = mobile,
                        Memo = memo,
                        Account = 0,
                        RoleID = role,
                        Contact = contact
                    };
                    if (new Main().UpdateDb(o, "tbl_admin_user", "id=" + id))
                    {
                        Log.AddAdminLog("", "修改账户" + name,0,admin.ID);
                        return ToJsonResult.GetR(0, "修改完成");
                    }  
                }
            }
            else
            {
                return ToJsonResult.GetR(1, "该账户已存在，不能重复");
            }
        }
        return ToJsonResult.GetR(1, "添加失败");
    }

    /// <summary>
    /// 获取账户列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetAdminUserList(HttpContext c)
    {
        string key = string.IsNullOrEmpty(c.Request["key"]) ? "" : c.Request["key"].ToString();
        key = c.Server.UrlDecode(key);
        string keyword = "";
        if (key.Length > 0)
        {
            keyword = " and (name like '%" + key + "%' or mobile like '%" + key + "%' or uName like '%" + key + "%' or memo like '%" + key + "%')";
        }
        string sql = "select * from tbl_admin_user where 1=1 " + keyword + "order by addOn desc";
        List<adminInfo> lo = new _AdminUser().GetAdminUserList(sql);
        if (lo != null && lo.Count > 0)
        {
            var o = new { Return = 0, Msg = "", List = lo };
            return JsonMapper.ToJson(o);
        }
        return ToJsonResult.GetR(1, "");
    }

    /// <summary>
    /// 删除账户
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string DelAdmin(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt16(c.Request["id"]);
        int enable = string.IsNullOrEmpty(c.Request["enable"]) ? 1 : Convert.ToInt16(c.Request["enable"]);
        string Name = string.IsNullOrEmpty(c.Request["Name"]) ? "" : c.Request["Name"].ToString();
        Name = c.Server.UrlDecode(Name);
        if (id > 0)
        {
            var o = new
            {
                Enable = enable
            };
            if (new Main().UpdateDb(o, "tbl_admin_user", "id=" + id))
            {
                return ToJsonResult.GetR(0, "操作完成");
            }
        }
        return ToJsonResult.GetR(1, "");
    }

    /// <summary>
    /// 删除角色
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string DelRole(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt16(c.Request["id"]);
        string Name = string.IsNullOrEmpty(c.Request["Name"]) ? "" : c.Request["Name"].ToString();
        Name = c.Server.UrlDecode(Name);
        if (id > 0)
        {
            if (new Main().DelDb("tbl_admin_role", "id=" + id))
            {
                return ToJsonResult.GetR(0, "操作完成");
            }
        }
        return ToJsonResult.GetR(1, "");
    }


    /// <summary>
    /// 添加修改角色
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string Role(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt16(c.Request["id"]);
        string roleName = string.IsNullOrEmpty(c.Request["roleName"]) ? "" : c.Request["roleName"].ToString();
        string limits = string.IsNullOrEmpty(c.Request["limits"]) ? "" : c.Request["limits"].ToString();
        roleName = c.Server.UrlDecode(roleName);
        if (id == 0)
        {
            if (new _AdminRole().CheckRole(roleName) == 0)
            {
                adminRole p = new adminRole
                {
                    RoleName = roleName,
                    Limits = limits
                };
                if (new Main().AddToDb(p, "tbl_admin_role"))
                {
                    Log.AddAdminLog("", "添加角色," + roleName,0,admin.ID);
                    return ToJsonResult.GetR(0, "添加完成");
                }
            }
            else
            {
                return ToJsonResult.GetR(1, "该角色名称已存在，不能重复添加");
            }
        }
        else
        {
            if (new _AdminRole().CheckRole(roleName) == 0 || new _AdminRole().CheckRole(roleName) == id)
            {
                var o = new
                {
                    RoleName = roleName,
                    Limits = limits
                };
                if (new Main().UpdateDb(o, "tbl_admin_role", "id=" + id))
                {
                    Log.AddAdminLog("", "修改角色" + roleName,0,admin.ID);
                    return ToJsonResult.GetR(0, "修改完成");
                }
            }
            else
            {
                return ToJsonResult.GetR(1, "该角色已存在，不能重复");
            }
        }
        return ToJsonResult.GetR(1, "添加失败");
    }


    /// <summary>
    /// 添加修改分类
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string OperClass(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt16(c.Request["id"]);
        int parId = string.IsNullOrEmpty(c.Request["parId"]) ? 0 : Convert.ToInt16(c.Request["parId"]);
        int descNum = string.IsNullOrEmpty(c.Request["descNum"]) ? 0 : Convert.ToInt16(c.Request["descNum"]);
        string className = string.IsNullOrEmpty(c.Request["className"]) ? "" : c.Request["className"].ToString();
        className = c.Server.UrlDecode(className);
        if (id == 0)
        {
            if (new _Class().CheckClass(className,parId,admin.ID) == 0)
            {
                Class p = new Class
                {
                    AdminID = admin.ID,
                    ClassName = className,
                    Leavel = 0,
                    PID = parId,
                    DescNum = descNum
                };
                if (new Main().AddToDb(p, "tbl_service_class"))
                {
                    Log.AddAdminLog("", "添加分类," + className,0,admin.ID);
                    return ToJsonResult.GetR(0, "添加完成");
                }
            }
            else
            {
                return ToJsonResult.GetR(1, "该分类名称已存在，不能重复添加");
            }
        }
        else
        {
            if (new _Class().CheckClass(className, parId,admin.ID) == 0 || new _Class().CheckClass(className, parId,admin.ID) == id)
            {
                var o = new
                {
                    AdminID = admin.ID,
                    ClassName = className,
                    Leavel = 0,
                    PID = parId,
                    DescNum = descNum
                };
                if (new Main().UpdateDb(o, "tbl_service_class", "id=" + id))
                {
                    Log.AddAdminLog("", "修改分类" + className,0,admin.ID);
                    return ToJsonResult.GetR(0, "修改完成");
                }
            }
            else
            {
                return ToJsonResult.GetR(1, "该分类已存在，不能重复");
            }
        }
        return ToJsonResult.GetR(1, "添加失败");
    }

    /// <summary>
    /// 添加修改短语
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string OperShort(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt16(c.Request["id"]);
        string Content = string.IsNullOrEmpty(c.Request["content"]) ? "" : c.Request["content"].ToString();
        string Title = string.IsNullOrEmpty(c.Request["Title"]) ? "" : c.Request["Title"].ToString();
        Content = c.Server.UrlDecode(Content);
        Title = c.Server.UrlDecode(Title);
        if (id == 0)
        {
            if (new _ShortInfo().CheckShort(Content,admin.ID) == 0)
            {
                ShortInfo p = new ShortInfo
                {
                    AdminID = admin.ID,
                    Content = Content,
                    Title = Title,
                    AddOn = DateTime.Now
                };
                if (new Main().AddToDb(p, "tbl_service_short"))
                {
                    Log.AddAdminLog("", "添加常用短语," + Content, 0,admin.ID);
                    return ToJsonResult.GetR(0, "添加完成");
                }
            }
            else
            {
                return ToJsonResult.GetR(1, "该常用短语已存在，不能重复添加");
            }
        }
        else
        {
            if (new _ShortInfo().CheckShort(Content,admin.ID) == 0 || new _ShortInfo().CheckShort(Content,admin.ID) == id)
            {
                var o = new
                {
                    AdminID = admin.ID,
                    Title = Title,
                    Content = Content
                };
                if (new Main().UpdateDb(o, "tbl_service_short", "id=" + id))
                {
                    Log.AddAdminLog("", "常用短语" + Content, 0,admin.ID);
                    return ToJsonResult.GetR(0, "修改完成");
                }
            }
            else
            {
                return ToJsonResult.GetR(1, "该常用短语，不能重复");
            }
        }
        return ToJsonResult.GetR(1, "添加失败");
    }


    /// <summary>
    /// 配置通道
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string SetChannel(HttpContext c)
    {
        int AdminID = string.IsNullOrEmpty(c.Request["AdminID"]) ? 0 : Convert.ToInt16(c.Request["AdminID"]);
        int ChannelID = string.IsNullOrEmpty(c.Request["ChannelID"]) ? 0 : Convert.ToInt16(c.Request["ChannelID"]);
        int SignType = string.IsNullOrEmpty(c.Request["SignType"]) ? 0 : Convert.ToInt16(c.Request["SignType"]);
        int MaxNum = string.IsNullOrEmpty(c.Request["MaxNum"]) ? 0 : Convert.ToInt32(c.Request["MaxNum"]);
        string SignName = string.IsNullOrEmpty(c.Request["SignName"]) ? "" : c.Request["SignName"].ToString();
        SignName = c.Server.UrlDecode(SignName);
        adminInfo ai = new _AdminUser().adminInfo(AdminID);
        if (ai != null)
        {
            if (ai.channelSet == null)
            {
                smsChannelSetting sc = new smsChannelSetting
                {
                    AddOn = DateTime.Now,
                    ChannelID = ChannelID,
                    AdminID = AdminID,
                    BakChannelID = 0,
                    Grade = 0,
                    SignName = SignName,
                    SignType = SignType,
                    MaxNum = MaxNum,
                    SendType = 0,
                    LNum = 70 - SignName.Length
                };
                if (new Main().AddToDb(sc, "tbl_channel_setting"))
                {
                    return ToJsonResult.GetR(0, "配置完成");
                } 
            }
            else
            {
                var sc = new
                {
                    ChannelID = ChannelID,
                    AdminID = AdminID,
                    BakChannelID = 0,
                    Grade = 0,
                    SignName = SignName,
                    SignType = SignType,
                    MaxNum = MaxNum,
                    SendType = 0,
                    LNum = 70 - SignName.Length
                };
                if (new Main().UpdateDb(sc, "tbl_channel_setting", "ID=" + ai.channelSet.ID))
                {
                    return ToJsonResult.GetR(0, "配置完成");
                }
            }
        }
        return ToJsonResult.GetR(1, "配置失败");
    }


    /// <summary>
    /// 获取短语列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetShortList(HttpContext c)
    {
        List<ShortInfo> lo = new _ShortInfo().GetShortList(admin.ID);
        if (lo != null && lo.Count > 0)
        {
            var o = new { Return = 0, Msg = "", List = lo };
            return JsonMapper.ToJson(o);
        }
        return ToJsonResult.GetR(1, "");
    }

    /// <summary>
    /// 删除常用短语
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string DelShort(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt16(c.Request["id"]);
        string Name = string.IsNullOrEmpty(c.Request["Name"]) ? "" : c.Request["Name"].ToString();
        Name = c.Server.UrlDecode(Name);
        if (id > 0)
        {
            var o = new
            {
                enable = -1
            };
            if (new Main().UpdateDb(o, "tbl_service_short", "id=" + id))
            {
                Log.AddAdminLog("", "删除常用短语:" + Name, 0,admin.ID);
                return ToJsonResult.GetR(0, "删除完成");
            }
        }
        return ToJsonResult.GetR(1, "删除失败，请重新登陆后再试");
    }

    /// <summary>
    /// 添加修改通讯录
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string OperContact(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt16(c.Request["id"]);
        int ClassID = string.IsNullOrEmpty(c.Request["ClassID"]) ? 0 : Convert.ToInt16(c.Request["ClassID"]);
        string Contact = string.IsNullOrEmpty(c.Request["Contact"]) ? "" : c.Request["Contact"].ToString();
        string Mobile = string.IsNullOrEmpty(c.Request["Mobile"]) ? "" : c.Request["Mobile"].ToString();
        string Memo = string.IsNullOrEmpty(c.Request["Memo"]) ? "" : c.Request["Memo"].ToString();
        Contact = c.Server.UrlDecode(Contact);
        Mobile = c.Server.UrlDecode(Mobile);
        Memo = c.Server.UrlDecode(Memo);
        if (id == 0)
        {
            if (new _Address().CheckAddr(Mobile, ClassID,admin.ID) == 0)
            {
                Address p = new Address
                {
                    AdminID = admin.ID,
                    Contact = Contact,
                    Mobile = Mobile,
                    Memo = Memo,
                    ClassID = ClassID,
                    AddOn = DateTime.Now
                };
                if (new Main().AddToDb(p, "tbl_service_address"))
                {
                    Log.AddAdminLog("", "添加通讯录," + Contact + "[" + Mobile + "]", 0,admin.ID);
                    return ToJsonResult.GetR(0, "添加完成");
                }
            }
            else
            {
                return ToJsonResult.GetR(1, "分组中已存在该手机号码，不能重复添加");
            }
        }
        else
        {
            if (new _Address().CheckAddr(Mobile, ClassID, admin.ID) == 0 || new _Address().CheckAddr(Mobile, ClassID, admin.ID) == id)
            {
                var o = new
                {
                    AdminID = admin.ID,
                    Contact = Contact,
                    Mobile = Mobile,
                    Memo = Memo,
                    ClassID = ClassID
                };
                if (new Main().UpdateDb(o, "tbl_service_address", "id=" + id))
                {
                    Log.AddAdminLog("", "修改通讯录" + Contact + "[" + Mobile + "]", 0,admin.ID);
                    return ToJsonResult.GetR(0, "修改完成");
                }
            }
            else
            {
                return ToJsonResult.GetR(1, "分组中已存在该手机号码，不能重复添加");
            }
        }
        return ToJsonResult.GetR(1, "添加失败,请重新登陆后再试");
    }

    /// <summary>
    /// 获取通讯录
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetAddressList(HttpContext c)
    {
        int page = string.IsNullOrEmpty(c.Request["page"]) ? 1 : Convert.ToInt16(c.Request["page"]);
        int ClassID = string.IsNullOrEmpty(c.Request["ClassID"]) ? 0 : Convert.ToInt16(c.Request["ClassID"]);

        string keyword = " and AdminID = " + admin.ID;
        if (ClassID > 0)
        {
            keyword += " and ClassID = " + ClassID;
        }

        string sql = "select * from tbl_service_address where enable=0 " + keyword + " order by addOn desc limit " + Convert.ToInt16((page - 1) * perPage) + "," + perPage;
        string sql_c = "select count(*) as t from tbl_service_address where enable=0 " + keyword + "";
        {
            int OCount = 1;
            List<AddressInfo> lo = new _Address().GetAddrList(sql, sql_c, out OCount);
            if (lo != null && lo.Count > 0)
            {
                var o = new { Return = 0, Msg = OCount, List = lo };
                return JsonMapper.ToJson(o);
            }
        }
        return ToJsonResult.GetR(1, "");
    }

    /// <summary>
    /// 获取多个分组通讯录明细
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetAddressForGroup(HttpContext c)
    {
        string ClassID = string.IsNullOrEmpty(c.Request["ClassID"]) ? "" : c.Request["ClassID"];
        if (ClassID.Length > 0)
        {
            List<string> ls = new _Address().GetGroupMx(ClassID);
            if (ls != null && ls.Count > 0)
            {
                var o = new { Return = 0, Msg = ls.Count.ToString(), List = ls };
                return JsonMapper.ToJson(o);                
            }
        }
        return ToJsonResult.GetR(1, "");
    }

    /// <summary>
    /// 获取权限列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetLimitList(HttpContext c)
    {
        List<adminLimit> la = new _AdminLimit().getLimit("*");
        if (la != null && la.Count > 0)
        {
            var o = new { Return = 0, Msg = "", List = la };
            return JsonMapper.ToJson(o);
        }
        return ToJsonResult.GetR(1, "");
    }

    /// <summary>
    /// 用户登陆
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string Login(HttpContext c)
    {
        string mobile = string.IsNullOrEmpty(c.Request["mobile"]) ? "" : c.Request["mobile"].ToString();
        string pass = string.IsNullOrEmpty(c.Request["pass"]) ? "" : c.Request["pass"].ToString();
        new Main().AddTestLog("[M]Login", mobile+","+pass);
        if (mobile.Length > 0 && pass.Length > 0)
        {
            adminUser ad = new _AdminUser().checkUser(mobile, BasicTool.MD5(pass));
            if (ad != null)
            {
                admin = ad;
                c.Cache.Remove("Admin_Info" + ad.ID);
                c.Cache.Add("Admin_Info" + ad.ID, ad, null, System.DateTime.UtcNow.AddMinutes(600), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
                Log.AddAdminLog("", "登录系统",4,admin.ID);
                var o = new
                {
                    Return = 0,
                    Msg = "",
                    adminSource = "",
                    Info = ad
                };
                return JsonMapper.ToJson(o);
            }
        }
        return ToJsonResult.GetR(1, "登陆失败");
    }
 
    /// <summary>
    /// 修改密码
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string UpdatePass(HttpContext c)
    {
        string oldpass = string.IsNullOrEmpty(c.Request["oldpass"]) ? "" : c.Request["oldpass"].ToString();
        string newpass = string.IsNullOrEmpty(c.Request["newpass"]) ? "" : c.Request["newpass"].ToString();
        string upPass = "修改失败";
        if (oldpass.Length > 0 && newpass.Length > 5)
        {
            upPass = new _AdminUser().UpdatePass(admin.LoginName, oldpass, newpass);
            if (upPass == "OK")
            {
                Log.AddAdminLog("", "修改密码",3,admin.ID);
                return ToJsonResult.GetR(0, "修改完成");
            }
        }
        return ToJsonResult.GetR(1, upPass);
    }
    
    /// <summary>
    /// 退出系统
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string LoginOut(HttpContext c)
    {
        string mobile = string.IsNullOrEmpty(c.Request["mobile"]) ? "" : c.Request["mobile"].ToString();
        Log.AddAdminLog("", "退出系统", 4, admin.ID);
        c.Cache.Remove("Admin_Info" + mobile);
        return ToJsonResult.GetR(0, "");
    }

    /// <summary>
    /// 获取菜单权限
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetLimit(HttpContext c)
    {
        if (admin != null)
        {
            string limit = admin.Limits;
            List<adminLimit> la = new _AdminLimit().getLimit(limit);
            if (la != null && la.Count > 0)
            {
                var o = new { Return = 0, Msg = "", List = la };
                return JsonMapper.ToJson(o);
            }
        }
        return ToJsonResult.GetR(1, "");
    }

    /// <summary>
    /// 获取分类列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetClass(HttpContext c)
    {
        List<classInfo> la = new _Class().GetClassList(0, 0);
        if (la != null && la.Count > 0)
        {
            var o = new { Return = 0, Msg = "", List = la };
            return JsonMapper.ToJson(o);
        }
        return ToJsonResult.GetR(1, "");
    }

    /// <summary>
    /// 获取系统日志
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetSysLogList(HttpContext c)
    {
        int page = string.IsNullOrEmpty(c.Request["page"]) ? 1 : Convert.ToInt16(c.Request["page"]);
        string streamNo = string.IsNullOrEmpty(c.Request["streamNo"]) ? "" : c.Request["streamNo"];
        string DateS = string.IsNullOrEmpty(c.Request["DateS"]) ? "" : c.Request["DateS"];
        string DateE = string.IsNullOrEmpty(c.Request["DateE"]) ? "" : c.Request["DateE"];
        string Content = string.IsNullOrEmpty(c.Request["Content"]) ? "" : c.Request["Content"];
        int lType = string.IsNullOrEmpty(c.Request["lType"]) ? -1 : Convert.ToInt16(c.Request["lType"]);

        string keyword = "";
        if (lType > -1)
        {
            keyword += " and logType = " + lType;
        }
        if (streamNo.Length > 0)
        {
            keyword += " and orderNo = '" + streamNo + "'";
        }
        if (Content.Length > 0)
        {
            keyword += " and Content like '%" + c.Server.UrlDecode(Content) + "%'";
        }
        if (DateS.Length > 0)
        {
            keyword += " and addOn >= '" + DateS + " 00:00:00'";
        }
        if (DateE.Length > 0)
        {
            keyword += " and addOn <= '" + DateE + " 23:59:59'";
        }
        //if (sourceId == 0 || workNo.Length > 0)
        string sql = "select * from tbl_admin_log where 1=1 " + keyword + " order by addOn desc limit " + Convert.ToInt16((page - 1) * perPage) + "," + perPage;
        string sql_c = "select count(*) as t from tbl_admin_log where 1=1 " + keyword + "";
        {
            int OCount = 1;
            List<adminLogInfo> lo = new _AdminLog().GetLogList(sql, sql_c, out OCount);
            if (lo != null && lo.Count > 0)
            {
                var o = new { Return = 0, Msg = OCount, List = lo };
                return JsonMapper.ToJson(o);
            }
        }
        return ToJsonResult.GetR(1, "");
    }

    /// <summary>
    /// 添加参数日志
    /// </summary>
    /// <param name="c"></param>
    public void AddQueryLog(HttpContext c)
    {
        int F = string.IsNullOrEmpty(c.Request["fn"]) ? 0 : Convert.ToInt16(c.Request["fn"]);
        new Main().AddTestLog("[A]F", F.ToString());
        string Query = "";
        foreach (string p in c.Request.Params.AllKeys)
        {
            Query += p + ":" + c.Request[p].ToString() + "&";
            if (p.IndexOf("ALL_HTTP") != -1)
            {
                break;
            }
        }
        new Main().AddTestLog("[A]Query-" + F.ToString(), Query.ToString());
    }
    
    public bool IsReusable {
        get {
            return false;
        }
    }

}