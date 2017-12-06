using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Rtdl.Sms.Model;
using Rtdl.Model.Count;
using Rtdl.Basic.Data;


namespace Rtdl.Basic.Data.Count
{
    public class _CountSendAll:DbCenter
    {
        public List<CountSendAll> GetSmsList(string sql)
        {
            List<CountSendAll> ls = new List<CountSendAll>();

            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    try
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            CountSendAll l = new CountSendAll
                            {
                                AdminID = Convert.ToInt16(r["AdminID"]),
                                MobileNum = Convert.ToInt32(r["MobileNum"]),
                                Count = Convert.ToInt16(r["Count"]),
                                FeeNum = Convert.ToInt32(r["FeeNum"])
                            };
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
    }
}
