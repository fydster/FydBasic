using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Rtdl.Basic.Model;

namespace Rtdl.Basic.Data
{
    public class _Address:DbCenter
    {
        public List<AddressInfo> GetAddrList(string sql, string sql_c, out int Count)
        {
            List<AddressInfo> ls = new List<AddressInfo>();

            int LogCount = 1;
            try
            {
                LogCount = Convert.ToInt32(helper.GetOne(sql_c));
            }
            catch
            {
                LogCount = 1;
            }
            Count = LogCount;

            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    try
                    {
                        Dictionary<int, string> Dic = new _Class().GetClassDic();
                        foreach (DataRow r in dt.Rows)
                        {
                            AddressInfo l = new AddressInfo
                            {
                                AddOn = Convert.ToDateTime(r["addOn"]),
                                Contact = r["Contact"].ToString(),
                                ClassID = Convert.ToInt16(r["ClassID"]),
                                Mobile = r["Mobile"].ToString(),
                                Memo = r["Memo"].ToString(),
                                ClassName = "",
                                ID = Convert.ToInt16(r["ID"])
                            };
                            if (Dic.ContainsKey(l.ClassID))
                            {
                                l.ClassName = Dic[l.ClassID];
                            }
                            ls.Add(l);
                        }
                    }
                    catch (Exception ex)
                    {

                    }
                }
            }
            return ls;
        }


        /// <summary>
        /// 获取分组人员数量
        /// </summary>
        /// <returns></returns>
        public Dictionary<int, int> GetGroupDic()
        {
            Dictionary<int, int> lc = new Dictionary<int, int>();
            string sql = "select ClassID,count(id) as t from tbl_service_address where enable = 0 group by ClassID";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            if (!lc.ContainsKey(Convert.ToInt16(r["ClassID"])))
                            {
                                lc.Add(Convert.ToInt16(r["ClassID"]), Convert.ToInt16(r["t"]));
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

        /// <summary>
        /// 获取分组人员字典
        /// </summary>
        /// <returns></returns>
        public Dictionary<string, int> GetClassDic(int ClassID)
        {
            Dictionary<string, int> lc = new Dictionary<string, int>();
            string sql = "select distinct Mobile from tbl_service_address where enable = 0 and ClassID = " + ClassID;
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            if (!lc.ContainsKey(r["Mobile"].ToString()))
                            {
                                lc.Add(r["Mobile"].ToString(),0);
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

        /// <summary>
        /// 获取分组人员手机号码明细
        /// </summary>
        /// <returns></returns>
        public List<string> GetGroupMx(string ClassIDS)
        {
            List<string> ls = new List<string>();
            string sql = "select distinct Mobile from tbl_service_address where enable = 0 and ClassID in(" + ClassIDS + ")";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            ls.Add(r["Mobile"].ToString());
                        }
                    }
                }
            }
            catch
            {
            }
            return ls;
        }


        /// <summary>
        /// 获取分组人员手机号码明细
        /// </summary>
        /// <returns></returns>
        public List<Address> GetGroupObjMx(string ClassIDS)
        {
            List<Address> ls = new List<Address>();
            string sql = "select * from tbl_service_address where enable = 0 and ClassID in(" + ClassIDS + ")";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            Address ad = new Address
                            {
                                Mobile = r["Mobile"].ToString(),
                                Contact = r["Contact"].ToString(),
                                Memo = r["Memo"].ToString()
                            };
                            ls.Add(ad);
                        }
                    }
                }
            }
            catch
            {
            }
            return ls;
        }


        public int CheckAddr(string Mobile, int ClassID,int AdminID)
        {
            int hid = 0;
            string sql = "select * from tbl_service_address where AdminID = " + AdminID + " and ClassID = " + ClassID + " and Mobile = '" + Mobile + "' and enable = 0";
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
