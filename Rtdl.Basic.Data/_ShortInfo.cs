using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Rtdl.Basic.Model;

namespace Rtdl.Basic.Data
{
    public class _ShortInfo:DbCenter
    {
        public List<ShortInfo> GetShortList(int AdminID)
        {
            List<ShortInfo> lc = new List<ShortInfo>();
            string sql = "select * from tbl_service_short where AdminID = " + AdminID + " and enable > -1 order by id asc";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            ShortInfo c = new ShortInfo()
                            {
                                ID = Convert.ToInt32(r["id"]),
                                Title = r["Title"].ToString(),
                                Content = r["Content"].ToString(),
                                AddOn = Convert.ToDateTime(r["AddOn"])
                            };
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

        public int CheckShort(string Content,int AdminID)
        {
            int hid = 0;
            string sql = "select * from tbl_service_short where AdminID = " + AdminID + " and Content = '" + Content + "' and enable = 0";
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
