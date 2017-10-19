using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Rtdl.Basic.Model;
using Rtdl.Basic.Data;

/// <summary>
/// Log 的摘要说明
/// </summary>
public class Log
{
    public static void AddAdminLog(string StreamNo, string Content, int logType,int AdminID)
    {
        adminLog l = new adminLog
        {
            AddOn = DateTime.Now,
            Content = Content,
            StreamNo = StreamNo,
            AdminID = AdminID,
            LogType = logType
        };
        new Main().AddToDb(l, "tbl_admin_log");
    }
}