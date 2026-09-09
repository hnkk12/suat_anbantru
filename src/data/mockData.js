// Dữ liệu mẫu (mock) cho toàn bộ ứng dụng — không có backend, mọi thay đổi
// được lưu lại vào localStorage thông qua hook useLocalStorageState.

export const SCHOOL_YEARS = ['2023 - 2024', '2024 - 2025', '2025 - 2026', '2026 - 2027']

export const BOARDING_STATUS = {
  BAN_TRU: 'Bán trú',
  KHONG_BAN_TRU: 'Không bán trú',
  CHI_NGU: 'Chỉ ngủ bán trú',
}

export const seedClasses = [
  { id: 'c1', name: 'Lá 1', khoi: 'Mầm non', giaoVien: 'Nguyễn Thị Hoa', siSo: 28 },
  { id: 'c2', name: 'Lá 2', khoi: 'Mầm non', giaoVien: 'Trần Thị Mai', siSo: 30 },
  { id: 'c3', name: '1A', khoi: 'Khối 1', giaoVien: 'Lê Văn Nam', siSo: 32 },
  { id: 'c4', name: '2A', khoi: 'Khối 2', giaoVien: 'Phạm Thị Lan', siSo: 29 },
]

export const seedStudents = [
  {
    id: 's1', hoTen: 'Nguyễn Minh An', lop: '1A', ngaySinh: '2019-03-12',
    phuHuynh: 'Nguyễn Văn Bình', sdt: '0901234567', trangThai: BOARDING_STATUS.BAN_TRU,
  },
  {
    id: 's2', hoTen: 'Trần Bảo Châu', lop: '2A', ngaySinh: '2018-07-25',
    phuHuynh: 'Trần Văn Cường', sdt: '0912345678', trangThai: BOARDING_STATUS.BAN_TRU,
  },
  {
    id: 's3', hoTen: 'Lê Gia Hân', lop: 'Lá 1', ngaySinh: '2020-01-05',
    phuHuynh: 'Lê Thị Dung', sdt: '0923456789', trangThai: BOARDING_STATUS.CHI_NGU,
  },
  {
    id: 's4', hoTen: 'Phạm Đức Huy', lop: 'Lá 2', ngaySinh: '2020-05-18',
    phuHuynh: 'Phạm Văn Em', sdt: '0934567890', trangThai: BOARDING_STATUS.KHONG_BAN_TRU,
  },
]

export const seedTeacherAccounts = [
  { id: 't1', hoTen: 'Nguyễn Thị Hoa', email: 'hoa.nguyen@truongtest.edu.vn', sdt: '0987654321', lop: 'Lá 1', trangThai: 'Đang hoạt động' },
  { id: 't2', hoTen: 'Trần Thị Mai', email: 'mai.tran@truongtest.edu.vn', sdt: '0976543210', lop: 'Lá 2', trangThai: 'Đang hoạt động' },
  { id: 't3', hoTen: 'Lê Văn Nam', email: 'nam.le@truongtest.edu.vn', sdt: '0965432109', lop: '1A', trangThai: 'Đang hoạt động' },
  { id: 't4', hoTen: 'Phạm Thị Lan', email: 'lan.pham@truongtest.edu.vn', sdt: '0954321098', lop: '2A', trangThai: 'Tạm nghỉ' },
]

export const seedManagerInfo = {
  hoTen: 'Đỗ Thị Thanh Tâm',
  chucVu: 'Phó Hiệu trưởng phụ trách bán trú',
  sdt: '0909112233',
  email: 'tam.do@truongtest.edu.vn',
  ghiChu: 'Phụ trách tiếp nhận phản ánh về suất ăn bán trú của phụ huynh.',
}

export const seedCompanies = [
  {
    id: 'cty1', ten: 'Công ty TNHH Suất ăn An Lành', daiDien: 'Vũ Văn Phát', sdt: '0281234567',
    diaChi: '12 Nguyễn Trãi, Q.1, TP.HCM', trangThai: 'Đang hợp tác',
  },
  {
    id: 'cty2', ten: 'Công ty CP Thực phẩm Sạch Việt', daiDien: 'Hoàng Thị Yến', sdt: '0287654321',
    diaChi: '45 Lê Lợi, Q.3, TP.HCM', trangThai: 'Đang hợp tác',
  },
  {
    id: 'cty3', ten: 'Công ty Suất ăn Công nghiệp Minh Phát', daiDien: 'Đặng Văn Sơn', sdt: '0289988776',
    diaChi: '78 Cách Mạng Tháng 8, Q.10, TP.HCM', trangThai: 'Tạm ngưng',
  },
]

export const DAYS_OF_WEEK = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6']
export const MEALS = ['Bữa sáng', 'Bữa trưa', 'Bữa xế']

export const seedMenu = {
  'Thứ 2': { 'Bữa sáng': 'Cháo thịt bằm, sữa tươi', 'Bữa trưa': 'Cơm, thịt kho trứng, canh bí đỏ', 'Bữa xế': 'Sữa chua, trái cây' },
  'Thứ 3': { 'Bữa sáng': 'Phở gà', 'Bữa trưa': 'Cơm, cá kho, canh rau ngót', 'Bữa xế': 'Bánh flan' },
  'Thứ 4': { 'Bữa sáng': 'Bún thịt nướng', 'Bữa trưa': 'Cơm, gà chiên, canh chua', 'Bữa xế': 'Chè đậu xanh' },
  'Thứ 5': { 'Bữa sáng': 'Súp cua', 'Bữa trưa': 'Cơm, thịt kho tàu, canh cải', 'Bữa xế': 'Sữa tươi, bánh quy' },
  'Thứ 6': { 'Bữa sáng': 'Bánh mì trứng ốp la', 'Bữa trưa': 'Cơm, tôm rim, canh mồng tơi', 'Bữa xế': 'Trái cây theo mùa' },
}

export const EVAL_LEVELS = ['Tốt', 'Khá', 'Cần cải thiện']

export const seedEvaluations = [
  { id: 'e1', hocSinhId: 's1', ngay: '2026-09-08', anUong: 'Tốt', nguNghi: 'Tốt', yThuc: 'Tốt', nhanXet: 'Bé ăn hết suất, ngủ ngoan.' },
  { id: 'e2', hocSinhId: 's2', ngay: '2026-09-08', anUong: 'Khá', nguNghi: 'Tốt', yThuc: 'Khá', nhanXet: 'Bé ăn hơi chậm nhưng hết suất.' },
  { id: 'e3', hocSinhId: 's3', ngay: '2026-09-08', anUong: 'Cần cải thiện', nguNghi: 'Khá', yThuc: 'Tốt', nhanXet: 'Bé kén ăn rau.' },
]

export const seedDocuments = [
  { id: 'd1', ten: 'Thông tư hướng dẫn tổ chức bán trú 2026', loai: 'PDF', ngayDang: '2026-08-01', kichThuoc: '1.2 MB' },
  { id: 'd2', ten: 'Quy định an toàn thực phẩm bếp ăn trường học', loai: 'PDF', ngayDang: '2026-08-05', kichThuoc: '860 KB' },
  { id: 'd3', ten: 'Mẫu hợp đồng cung cấp suất ăn', loai: 'DOCX', ngayDang: '2026-08-10', kichThuoc: '45 KB' },
  { id: 'd4', ten: 'Kế hoạch kiểm tra vệ sinh an toàn thực phẩm Quý 3', loai: 'PDF', ngayDang: '2026-08-20', kichThuoc: '640 KB' },
]

export const seedRegistrations = []
