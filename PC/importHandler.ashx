<%@ WebHandler Language="C#" Class="importHandler" %>

using System;
using System.Web;
using System.Data;
using System.Data.OleDb;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using Rtdl.Basic.Model;
using Rtdl.Basic.Data;

public class importHandler : IHttpHandler {

    public static adminUser admin = null;
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        if (LoginCheck(context))
        {
            string result = ImportExcel(context);
            context.Response.Write(result);
        }
        else
        {
            context.Response.Write(ToJsonResult.GetR(100, "登陆状态失效，请重新登录后再试"));
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
    /// 导入excel
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    public string ImportExcel(HttpContext c)
    {
        int ClassID = string.IsNullOrEmpty(c.Request["ClassID"]) ? 0 : Convert.ToInt16(c.Request["ClassID"]);
        string FileName = string.IsNullOrEmpty(c.Request["importFile"]) ? "" : c.Request["importFile"].ToString();
        string rsa = "";
        DataTable d = InputExcel(c.Server.MapPath(FileName));
        if (d == null)
        {
            return ToJsonResult.GetR(1, "导入失败，请重新再试！");
        }
        Dictionary<string, int> s_Mobile = new _Address().GetClassDic(ClassID);
        if (d != null)
        {
            string mobile = "";
            string contact = "";
            string memo = "";
            int allNum = 0;
            int SusNum = 0;
            int ErrNum = 0;
            List<string> sqls = new List<string>();
            foreach (DataRow r in d.Rows)
            {
                mobile = r["手机号码"].ToString();
                contact = r["姓名"].ToString();
                memo = r["备注"].ToString();
                String ZipRegex = @"^1[3|4|5|7|8]\d{9}$";
                if (mobile.Length > 0)
                {
                    allNum += 1;
                    if (Regex.IsMatch(mobile, ZipRegex))
                    {
                        if (!s_Mobile.ContainsKey(mobile))
                        {
                            sqls.Add("Insert into tbl_service_address (Contact,ClassID,Mobile,Memo,AddOn) values ('" + contact + "'," + ClassID + ",'" + mobile + "','" + memo + "','" + DateTime.Now + "');");
                            SusNum += 1;
                            s_Mobile.Add(mobile, 0);
                        }
                    }
                    else
                    {
                        ErrNum += 1;
                    }
                }
            }
            if (new Main().ExecForSql(sqls))
            {
                rsa = "导入结果<br>总计导入:" + allNum + "条记录<br>导入成功:" + SusNum + "条<br>错误号码:" + ErrNum + "条<br>重复记录:" + (allNum - SusNum - ErrNum) + "条。";
            }
            else
            {
                return ToJsonResult.GetR(1, "导入失败，请重新再试！");
            }
            sqls = null;
        }
        else
        {
            return ToJsonResult.GetR(1, "导入失败，请重新再试！");
        }
        d = null;
        Log.AddAdminLog("", "按模板导入通讯录", 0, admin.ID);
        return ToJsonResult.GetR(0, rsa);
    }

    /// <summary>
    /// 读取excel
    /// </summary>
    /// <param name="Path"></param>
    /// <param name="TableName"></param>
    /// <param name="tablename2"></param>
    /// <returns></returns>
    public DataTable InputExcel(string Path)
    {
        try
        {
            string TableName = "";
            string strConn = "Provider=Microsoft.Jet.OLEDB.4.0;" + "Data Source=" + Path + ";" + "Extended Properties='Excel 8.0;HDR=yes'";
            OleDbConnection conn = new OleDbConnection(strConn);
            conn.Open();

            DataTable dtr = conn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
            if (dtr != null && dtr.Rows.Count > 0)
            {
                int sheetNum = 0;
                foreach (DataRow dr in dtr.Rows)
                {
                    if (sheetNum == 0) { TableName = (String)dr["TABLE_NAME"]; }
                    sheetNum++;
                }
            }

            string strExcel = "";
            OleDbDataAdapter myCommand = null;
            strExcel = "select * from [" + TableName + "]";
            myCommand = new OleDbDataAdapter(strExcel, strConn);
            DataTable dt = new DataTable();
            myCommand.Fill(dt);
            conn.Close();
            return dt;
        }
        catch (Exception ex)
        {
            //throw new Exception(ex.Message);
            return null;
        }
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}