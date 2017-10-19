using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Rtdl.Basic.Model;

namespace Rtdl.Basic.Data
{
    public class _Class:DbCenter
    {
        public List<classInfo> GetClassList(int parId, int AdminID)
        {
            List<classInfo> lc = new List<classInfo>();
            string sql = "select * from tbl_service_class where AdminID = " + AdminID + " and PID = " + parId + " and enable > -1 order by descNum desc, id asc";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        Dictionary<int, string> Dic = GetClassDic();
                        Dictionary<int, int> DicA = new _Address().GetGroupDic();
                        foreach (DataRow r in dt.Rows)
                        {
                            classInfo c = new classInfo()
                            {
                                ID = Convert.ToInt32(r["id"]),
                                ClassID = Convert.ToInt32(r["ClassID"]),
                                Leavel = Convert.ToInt16(r["Leavel"]),
                                ClassName = r["ClassName"].ToString(),
                                PID = Convert.ToInt16(r["PID"]),
                                DescNum = Convert.ToInt16(r["DescNum"]),
                                ClassType = Convert.ToInt16(r["ClassType"]),
                                AddrNum = 0,
                                PName = ""
                            };
                            if (Dic.ContainsKey(c.PID))
                            {
                                c.PName = Dic[c.PID];
                            }
                            if (DicA.ContainsKey(c.ID))
                            {
                                c.AddrNum = DicA[c.ID];
                            }
                            lc.Add(c);
                        }
                    }
                }
            }
            catch
            {
            }
            return lc;
        }

        /// <summary>
        /// 获取分类字典
        /// </summary>
        /// <returns></returns>
        public Dictionary<int, string> GetClassDic()
        {
            Dictionary<int, string> lc = new Dictionary<int, string>();
            string sql = "select * from tbl_service_class";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            if (!lc.ContainsKey(Convert.ToInt16(r["id"])))
                            {
                                lc.Add(Convert.ToInt16(r["id"]), r["ClassName"].ToString());
                            }
                        }
                    }
                }
            }
            catch
            {
            }
            return lc;
        }

        public int CheckClass(string className, int parId,int AdminID)
        {
            int hid = 0;
            string sql = "select * from tbl_service_class where AdminID = " + AdminID + " and PID = " + parId + " and ClassName = '" + className + "' and enable = 0";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    hid = Convert.ToInt16(dt.Rows[0]["Id"]);
                }
            }
            return hid;
        }
    }
}
