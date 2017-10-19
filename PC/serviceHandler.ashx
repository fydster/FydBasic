<%@ WebHandler Language="C#" Class="serviceHandler" %>

using System;
using System.Web;
using Rtdl.Basic.Model;
using Rtdl.Basic.Data;
using Rtdl.Sms.Model;
using Rtdl.Sms.Data;
using LitJson;
using System.Linq;
using System.Collections.Generic;
using com.seascape.tools;

public class serviceHandler : IHttpHandler {

    public static int perPage = 100;
    public static adminUser admin = null;
    public static string BaseUrl = "http://sms.tyrtdl.cn/";

    public void ProcessRequest(HttpContext c)
    {
        int F = string.IsNullOrEmpty(c.Request["fn"]) ? 0 : Convert.ToInt16(c.Request["fn"]);
        AddQueryLog(c);
        c.Response.ContentType = "text/plain";
        if (F != 0 && F != 19 && F != 40)
        {
            if (LoginCheck(c))
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
    /// 登陆验证
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public bool LoginCheck(HttpContext c)
    {
        string mobile = string.IsNullOrEmpty(c.Request["mobile_cookie"]) ? "" : c.Request["mobile_cookie"].ToString();
        mobile = mobile.Replace(",", "");
        if (c.Cache["Admin_Info" + mobile] != null)
        {
            admin = (adminUser)c.Cache["Admin_Info" + mobile];
            c.Cache.Remove("Admin_Info" + mobile);
            c.Cache.Add("Admin_Info" + mobile, admin, null, System.DateTime.UtcNow.AddMinutes(600), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
            return true;
        }
        return false;
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
                case 100:
                    Result = SendSms(c);//发送短信
                    break;
                case 101:
                    Result = GetSmsSendList(c);//发送列表
                    break;
                case 102:
                    Result = GetSmsSendMx(c);//获取发送明细
                    break;
                case 103:
                    Result = GetKeyWordList(c);//获取关键字列表
                    break;
                case 104:
                    Result = GetMoList(c);//获取接收短信
                    break;
            }
        }
        catch (Exception e)
        {
            Result = e.Message.ToString();
        }
        new Main().AddTestLog("[A]Result" + f, Result);
        return Result;
    }

    /// <summary>
    /// 发送短信
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string SendSms(HttpContext c)
    {
        string mobiles = string.IsNullOrEmpty(c.Request["mobiles"]) ? "" : c.Request["mobiles"].ToString();
        string content = string.IsNullOrEmpty(c.Request["content"]) ? "" : c.Request["content"].ToString();
        string classIDs = string.IsNullOrEmpty(c.Request["classIDs"]) ? "" : c.Request["classIDs"].ToString();
        content = c.Server.UrlDecode(content);
        if (mobiles.Length > 0 && content.Length > 0)
        {
            content = content.Replace("强奸", "强_奸");
            content = content.Replace("杀人", "杀_人");
            content = content.Replace("法院", "法_院");
            
            int SendType = 0;

            if (mobiles.Substring(mobiles.Length - 1, 1) == ",")
            {
                mobiles = mobiles.Substring(0, mobiles.Length - 1);
            }
            
            List<string> ls = new List<string>(mobiles.Split(','));
            ls.Distinct();

            int mobileNum = ls.Count;

            //余额
            int feeNum = 0;
            int MaxNum = 0;
            int channelID = 0;
            int perNum = 1;
            Dictionary<int, smsChannelSetting> Dic = new _SmsChannelSetting().GetSmsChannelSettingDic();
            if (Dic.ContainsKey(admin.ID))
            {
                int LNum = Dic[admin.ID].LNum;
                MaxNum = Dic[admin.ID].MaxNum;
                channelID = Dic[admin.ID].ID;

                if (content.Length > LNum)
                {
                    perNum = Convert.ToInt16(Math.Ceiling(Convert.ToDouble(content.Length - LNum) / 67)) + 1;
                }
                feeNum = perNum * mobileNum;
                if (feeNum > MaxNum)
                {
                    return ToJsonResult.GetR(1, "发送失败，余额不足，请联系管理员充值后再发");
                }
            }
            else
            {
                return ToJsonResult.GetR(1, "发送失败，账户异常，请稍后再试");
            }
            
            if (classIDs.Length > 0)
            {
                SendType = 1;
                mobiles = classIDs;
            }

            List<string> sqls = new List<string>();

            if (mobileNum > 1000)
            {
                int tempN = 0;
                for (int mi = 1; mi < 100; mi++)
                {
                    tempN = 0;
                    string tempMobiles = "";
                    for (int ti = (1000 * (mi-1)); ti < (1000 * mi); ti++)
                    {
                        if (ti < ls.Count)
                        {
                            tempMobiles += ls[ti] + ",";
                            tempN++;
                        }
                        
                    }

                    sqls.Add("insert into tbl_sms(AddOn,StreamNo,AdminID,ChannelID,Content,FeeNum,State,MobileNum,Mobiles,SendType) values('" + DateTime.Now + "','" + DateTime.Now.ToString("yyMMddHHmmss") + admin.ID.ToString().PadLeft(4, '0') + mi.ToString().PadLeft(2, '0') + "'," + admin.ID + ",0,'" + content + "'," + (tempN * perNum) + ",0," + tempN + ",'" + tempMobiles + "'," + SendType + ")");                  
                    if (tempN < 1000)
                    {
                        break;
                    }
                }

                if (new Main().ExecForSql(sqls))
                {
                    var o = new
                    {
                        MaxNum = MaxNum - feeNum
                    };
                    new Main().UpdateDb(o, "tbl_channel_setting", "id=" + channelID);
                    Log.AddAdminLog("", "发送短信，总计" + feeNum + "条", 4, admin.ID);
                    return ToJsonResult.GetR(0, "发送成功");                    
                }
            }
            else
            {
                smsStream sms = new smsStream
                {
                    AddOn = DateTime.Now,
                    StreamNo = DateTime.Now.ToString("yyMMddHHmmss") + admin.ID.ToString().PadLeft(4, '0'),
                    AdminID = admin.ID,
                    ChannelID = 0,
                    Content = content,
                    FeeNum = feeNum,
                    MobileNum = mobileNum,
                    Mobiles = mobiles,
                    SendType = SendType
                };
                if (new Main().AddToDb(sms, "tbl_sms"))
                {
                    var o = new
                    {
                        MaxNum = MaxNum - feeNum
                    };
                    new Main().UpdateDb(o, "tbl_channel_setting", "id=" + channelID);
                    Log.AddAdminLog(sms.StreamNo, "发送短信，总计" + feeNum + "条", 4, admin.ID);
                    return ToJsonResult.GetR(0, "发送成功");
                }
            }


        }

        return ToJsonResult.GetR(1, "发送失败，请稍后再试");
    }

    /// <summary>
    /// 获取发送记录列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetSmsSendList(HttpContext c)
    {
        string Mobile = string.IsNullOrEmpty(c.Request["Mobile"]) ? "" : c.Request["Mobile"].ToString();
        string Content = string.IsNullOrEmpty(c.Request["Content"]) ? "" : c.Request["Content"].ToString();
        string DateS = string.IsNullOrEmpty(c.Request["DateS"]) ? "" : c.Request["DateS"].ToString();
        string DateE = string.IsNullOrEmpty(c.Request["DateE"]) ? "" : c.Request["DateE"].ToString();
        int page = string.IsNullOrEmpty(c.Request["page"]) ? 1 : Convert.ToInt16(c.Request["page"]);
        int State = string.IsNullOrEmpty(c.Request["State"]) ? -1 : Convert.ToInt16(c.Request["State"]);

        Content = c.Server.UrlDecode(Content);
        
        string keyword = "";
        if (State > -1)
        {
            keyword += " and State = " + State;
        }
        if (Mobile.Length > 0)
        {
            keyword += " and streamNo in(select streamNo from tbl_sms_mx where Mobile = '" + Mobile + "') ";
        }
        if (Content.Length > 0)
        {
            keyword += " and Content like '%" + Content + "%'";
        }
        if (DateS.Length > 0)
        {
            keyword += " and Date(AddOn) >= '" + DateS + "'";
        }
        if (DateE.Length > 0)
        {
            keyword += " and Date(AddOn) <= '" + DateE + "'";
        }
        string sql = "select * from tbl_sms where AdminID = " + admin.ID + " " + keyword + " order by addOn desc limit " + Convert.ToInt16((page - 1) * perPage) + "," + perPage;
        string sql_c = "select count(*) as t from tbl_sms where AdminID = " + admin.ID + " " + keyword + "";
        {
            int OCount = 1;
            List<smsStream> lo = new _SmsStream().GetSmsList(sql, sql_c, out OCount);
            if (lo != null && lo.Count > 0)
            {
                var o = new { Return = 0, Msg = OCount, List = lo };
                return JsonMapper.ToJson(o);
            }
        }
        return ToJsonResult.GetR(1, "");
    }

    /// <summary>
    /// 获取接收记录列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetMoList(HttpContext c)
    {
        string Mobile = string.IsNullOrEmpty(c.Request["Mobile"]) ? "" : c.Request["Mobile"].ToString();
        string Content = string.IsNullOrEmpty(c.Request["Content"]) ? "" : c.Request["Content"].ToString();
        string DateS = string.IsNullOrEmpty(c.Request["DateS"]) ? "" : c.Request["DateS"].ToString();
        string DateE = string.IsNullOrEmpty(c.Request["DateE"]) ? "" : c.Request["DateE"].ToString();
        int page = string.IsNullOrEmpty(c.Request["page"]) ? 1 : Convert.ToInt16(c.Request["page"]);

        Content = c.Server.UrlDecode(Content);

        string keyword = "";
        if (Mobile.Length > 0)
        {
            keyword += " and Mobile = '" + Mobile + "' ";
        }
        if (Content.Length > 0)
        {
            keyword += " and Content like '%" + Content + "%'";
        }
        if (DateS.Length > 0)
        {
            keyword += " and Date(AddOn) >= '" + DateS + "'";
        }
        if (DateE.Length > 0)
        {
            keyword += " and Date(AddOn) <= '" + DateE + "'";
        }
        string sql = "select * from tbl_sms_mo where AdminID = " + admin.ID + " " + keyword + " order by addOn desc limit " + Convert.ToInt16((page - 1) * perPage) + "," + perPage;
        string sql_c = "select count(*) as t from tbl_sms where AdminID = " + admin.ID + " " + keyword + "";
        {
            int OCount = 1;
            List<smsMoInfo> lo = new _SmsMo().GetSmsList(sql, sql_c, out OCount);
            if (lo != null && lo.Count > 0)
            {
                var o = new { Return = 0, Msg = OCount, List = lo };
                return JsonMapper.ToJson(o);
            }
        }
        return ToJsonResult.GetR(1, "");
    }

    /// <summary>
    /// 获取发送明细列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetSmsSendMx(HttpContext c)
    {
        string streamNo = string.IsNullOrEmpty(c.Request["streamNo"]) ? "" : c.Request["streamNo"].ToString();
        if (streamNo.Length > 0)
        {
            int OCount = 1;
            List<smsMx> lo = new _SmsMx().GetSmsMxList(streamNo, -1);
            if (lo != null && lo.Count > 0)
            {
                var o = new { Return = 0, Msg = OCount, List = lo };
                return JsonMapper.ToJson(o);
            }
        }
        return ToJsonResult.GetR(1, "");
    }

    /// <summary>
    /// 获取关键字列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetKeyWordList(HttpContext c)
    {
        
        if (c.Cache["Sms_KeyWords"] != null)
        {
            List<string> lo = (List<string>)c.Cache["Sms_KeyWords"];
            var o = new { Return = 0, Msg = "", List = lo };
            return JsonMapper.ToJson(o);
        }
        else
        {
            List<string> lo = new _SmsKeyWords().GetKeyList();
            if (lo != null && lo.Count > 0)
            {
                c.Cache.Add("Sms_KeyWords", lo, null, System.DateTime.UtcNow.AddDays(30), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
                var o = new { Return = 0, Msg = "", List = lo };
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