using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Rtdl.Basic.Model;

namespace Rtdl.Basic.Data
{
    public class _AdminLimit:DbCenter
    {
        /// <summary>
        /// 获取权限列表
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public List<adminLimit> getLimit(string limit)
        {
            List<adminLimit> la = new List<adminLimit>();
            string sql = "select * from tbl_admin_limit where enable = 0 order by DescNum asc";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        int cs = new Random().Next(10000, 99999);
                        foreach (DataRow r in dt.Rows)
                        {
                            if (limit.IndexOf("," + r["id"] + ",") > -1 || limit == "*")
                            {
                                adminLimit a = new adminLimit
                                {
                                    ID = Convert.ToInt16(r["id"]),
                                    LimitName = r["LimitName"].ToString(),
                                    LimitUrl = r["LimitUrl"].ToString() + "?v=" + cs,
                                    LimitType = Convert.ToInt16(r["LimitType"]),
                                    TypeName = r["TypeName"].ToString(),
                                    Icon = r["Icon"].ToString(),
                                    DescNum = Convert.ToInt16(r["DescNum"]),
                                    PID = Convert.ToInt16(r["PID"]),
                                    Enable = Convert.ToInt16(r["Enable"])
                                };
                                la.Add(a);
                            }
                        }
                    }
                }
            }
            catch { }
            return la;
        }

        public Dictionary<int, adminLimit> getLimitDic()
        {
            Dictionary<int, adminLimit> dic = new Dictionary<int, adminLimit>();
            string sql = "select * from tbl_admin_limit where enable = 0 order by DescNum asc";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            adminLimit a = new adminLimit
                            {
                                ID = Convert.ToInt16(r["id"]),
                                LimitName = r["LimitName"].ToString(),
                                LimitUrl = r["LimitUrl"].ToString(),
                                LimitType = Convert.ToInt16(r["LimitType"]),
                                TypeName = r["TypeName"].ToString(),
                                Icon = r["Icon"].ToString(),
                                DescNum = Convert.ToInt16(r["DescNum"]),
                                PID = Convert.ToInt16(r["PID"]),
                                Enable = Convert.ToInt16(r["Enable"])
                            };
                            dic.Add(a.ID, a);
                        }
                    }
                }
            }
            catch { }
            return dic;
        }
    }
}
