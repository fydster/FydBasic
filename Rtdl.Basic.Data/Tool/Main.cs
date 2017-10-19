using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using com.seascape.db;
using System.Data;

namespace Rtdl.Basic.Data
{
    public class Main:DbCenter
    {

        /// <summary>
        /// 直接插入数据库操作
        /// </summary>
        /// <param name="o"></param>
        /// <param name="tableName"></param>
        /// <returns></returns>
        public bool AddToDb(object o,string tableName)
        {
            SqlObject s = new SqlObject(SqlObjectType.Insert, tableName,DBTYPE.MySql);
            foreach (System.Reflection.PropertyInfo p in o.GetType().GetProperties())
            {
                if (p.GetValue(o, null) != null && p.GetValue(o, null).ToString().Length > 0)
                {
                    if (p.Name != "id" && p.Name != "helper")
                    {
                        s.AddField(p.Name, p.GetValue(o, null), GetSqlFieldType(p.PropertyType.Name));
                    }
                }
            }
            return helper.ExecuteSqlNoResult(s.ToString());
        }

        /// <summary>
        /// 获取SQL语句
        /// </summary>
        /// <param name="o"></param>
        /// <param name="tableName"></param>
        /// <returns></returns>
        public string GetSqlInfo(object o, string tableName)
        {
            SqlObject s = new SqlObject(SqlObjectType.Insert, tableName, DBTYPE.MySql);
            foreach (System.Reflection.PropertyInfo p in o.GetType().GetProperties())
            {
                if (p.GetValue(o, null) != null && p.GetValue(o, null).ToString().Length > 0)
                {
                    if (p.Name != "id" && p.Name != "helper")
                    {
                        s.AddField(p.Name, p.GetValue(o, null), GetSqlFieldType(p.PropertyType.Name));
                    }
                }
            }
            return s.ToString();
        }

        /// <summary>
        /// 直接插入数据库操作并获取ID
        /// </summary>
        /// <param name="o"></param>
        /// <param name="tableName"></param>
        /// <returns></returns>
        public int AddToDbForId(object o, string tableName)
        {
            SqlObject s = new SqlObject(SqlObjectType.Insert, tableName, DBTYPE.MySql);
            foreach (System.Reflection.PropertyInfo p in o.GetType().GetProperties())
            {
                if (p.GetValue(o, null) != null && p.GetValue(o, null).ToString().Length > 0)
                {
                    if (p.Name != "id" && p.Name != "helper")
                    {
                        s.AddField(p.Name, p.GetValue(o, null), GetSqlFieldType(p.PropertyType.Name));
                    }
                }
            }
            return helper.InsertToDb(s.ToString());
        }

        /// <summary>
        /// 修改数据库
        /// </summary>
        /// <param name="o"></param>
        /// <param name="tableName"></param>
        /// <param name="where"></param>
        /// <returns></returns>
        public bool UpdateDb(object o, string tableName,string where)
        {
            SqlObject s = new SqlObject(SqlObjectType.Update, tableName, DBTYPE.MySql);
            foreach (System.Reflection.PropertyInfo p in o.GetType().GetProperties())
            {
                if (p.GetValue(o, null) != null)
                {
                    if (p.Name != "id" && p.Name != "helper")
                    {
                        s.AddField(p.Name, p.GetValue(o, null), GetSqlFieldType(p.PropertyType.Name));
                    }
                }
            }
            s.Where = where;
            return helper.ExecuteSqlNoResult(s.ToString());
        }

        /// <summary>
        /// 字段加1操作
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="field"></param>
        /// <param name="where"></param>
        /// <returns></returns>
        public bool AddOneForField(string tableName, string field,string where,int addNum)
        {
            string sql = "Update " + tableName + " set " + field + " = " + field + " + " + addNum + " where " + where;
            return helper.ExecuteSqlNoResult(sql);
        }

        /// <summary>
        /// 执行全部SQL并返回结果
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public bool ExecForSql(List<string> s)
        {
            return helper.ExecuteTransaction(s);
        }

        /// <summary>
        /// 数据库删除
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="where"></param>
        /// <returns></returns>
        public bool DelDb(string tableName, string where)
        {
            string s = "delete from " + tableName + " where "+where;
            return helper.ExecuteSqlNoResult(s.ToString());
        }

        public SqlFieldType GetSqlFieldType(string t)
        {
            switch (t)
            {
                case "Int32":
                    return SqlFieldType.Int;
                case "Int16":
                    return SqlFieldType.Int;
                case "Int64":
                    return SqlFieldType.Int;
                case "bool":
                    return SqlFieldType.Bool;
                case "DateTime":
                    return SqlFieldType.DateTime;
                case "Double":
                    return SqlFieldType.Float;
            }
            return SqlFieldType.String;
        }


        /// <summary>
        /// 添加测试日志
        /// </summary>
        /// <param name="tName"></param>
        /// <param name="tValue"></param>
        public void AddTestLog(string tName, string tValue)
        {
            bool r = helper.ExecuteSqlNoResult("insert into t_TestLog(TestName,TestValue,AddOn,ltype) values('" + tName + "','" + tValue.Replace("'", "\"") + "','" + DateTime.Now + "',1)");
        }

        public void AddTestLog_B(string tName, string tValue)
        {
            helper.ExecuteSqlNoResult("insert into t_TestLog(TestName,TestValue,AddOn) values('" + tName + "','" + tValue.Replace("'", "\"") + "','" + DateTime.Now + "')");
        }

        /// <summary>
        /// 获取前200条日志
        /// </summary>
        /// <returns></returns>
        public string GetTestLogList(int ltype)
        {
            string ls = "";
            using (DataTable dt = helper.GetDataTable("select * from t_TestLog where lType = " + ltype + " order by addOn desc limit 0,200"))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    StringBuilder sb = new StringBuilder();
                    foreach (DataRow r in dt.Rows)
                    {
                        sb.Append(r["TestName"].ToString().Replace("Result", "返回结果").Replace("Query","接收参数") + "<br/>");
                        sb.Append(r["TestValue"].ToString() + "<br/>");
                        sb.Append("["+r["addOn"].ToString()+"]");
                        sb.Append("<br/>---------------------<br/>");
                    }
                    ls = sb.ToString();
                }
            }
            return ls;
        }
    }
}
