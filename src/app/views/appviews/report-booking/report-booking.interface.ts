import { AutoCompleteModel } from 'app/models/auto-complete-model';
import { IMyDateModel } from 'mydatepicker-th';

export class ReportBooking {
    branchType: string;
    branchId: AutoCompleteModel[];

    brandType: string;
    brandTypeId: AutoCompleteModel[];
    version: AutoCompleteModel[];
    design: AutoCompleteModel[];
    color: AutoCompleteModel[];

    bookingName: string;
    bookingNameId: string;
    regisNameId: string;

    bookingStatus: string;
    bookingStatusId: string;

    bookingDate: string;
    sDate: IMyDateModel;
    eDate: IMyDateModel;

    bookingReceiveDate: string;
    sBookingReceiveDate: IMyDateModel;
    eBookingReceiveDate: IMyDateModel;
}

// //สาขา
    // var branchType = $("input[name='rdoBranch']:checked").val();
    // var branchId = (branchType == 1 ? 0 : $("#txtBranch").val());
    // strParameter += "&branchType=" + branchType;
    // strParameter += "&branchId=" + branchId;

    // //ยี่ห้อ รุ่น แบบ สี
    // var brandType = $("input[name='rdoBrand']:checked").val();
    // var brandTypeId = (brandType == 1 ? 0 : $("#txtProductType").val()); 
    // var version = (brandType == 1 ? 0 : $("#txtVersion").val());
    // var design = (brandType == 1 ? 0 : $("#txtDesign").val());
    // var color = (brandType == 1 ? 0 : $("#txtColor").val());

    // if (brandTypeId == "") {
    //     brandTypeId = 0;
    // }

    // if (version == "") {
    //     version = 0;
    // }

    // if (design == "") {
    //     design = 0;
    // }

    // if (color == "") {
    //     color = 0;
    // }

    // strParameter += "&brandType=" + brandType;
    // strParameter += "&brandTypeId=" + brandTypeId;
    // strParameter += "&version=" + version;
    // strParameter += "&design=" + design;
    // strParameter += "&color=" + color;

    // //ชื่อผู้จอง/ชื่อจดทะเบียน
    // var bookingName = $("input[name='rdoBookingName']:checked").val();
    // var bookingNameId = (bookingName == 1 ? "" : $("input[name='hfBookingName']").val());
    // var regisNameId = (bookingName == 1 ? "" : $("input[name='hfRegisName']").val());
    // strParameter += "&bookingName=" + bookingName;
    // strParameter += "&bookingNameId=" + bookingNameId;
    // strParameter += "&regisNameId=" + regisNameId;

    // //สถานะใบจอง
    // var bookingStatus = $("input[name='rdoBookingStatus']:checked").val();
    // var bookingStatusId = (bookingStatus == 1 ? "" : $("#ddlBookingStatus").val());
    // strParameter += "&bookingStatus=" + bookingStatus;
    // strParameter += "&bookingStatusId=" + bookingStatusId;

    // //วันที่จอง
    // var bookingDate = $("input[name='rdoBookingDate']:checked").val();
    // var sDate = (bookingDate == 1 ? "" : $("#txtStartDate").val());
    // var eDate = (bookingDate == 1 ? "" : $("#txtEndDate").val());
    // strParameter += "&bookingDate=" + bookingDate;
    // strParameter += "&sDate=" + sDate;
    // strParameter += "&eDate=" + eDate;

    // //วันที่ถึงกำหนด
    // var bookingReceiveDate = $("input[name='rdoBookingReceiveDate']:checked").val();
    // var sBookingReceiveDate = (bookingReceiveDate == 1 ? "" : $("#txtStartBookingReceiveDate").val());
    // var eBookingReceiveDate = (bookingReceiveDate == 1 ? "" : $("#txtEndBookingReceiveDate").val());
    // strParameter += "&bookingReceiveDate=" +  bookingReceiveDate;
    // strParameter += "&sBookingReceiveDate=" + sBookingReceiveDate;
    // strParameter += "&eBookingReceiveDate=" + eBookingReceiveDate;