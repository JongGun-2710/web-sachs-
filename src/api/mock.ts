/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Book,
  Genre,
  Author,
  BookListParams,
  BookListResponse,
  ViewResponse,
  ViewedRecommendationsResponse,
  GoalSearchResponse,
  GENRES_MAP,
  MIN_VIEWS,
} from './types';
import { removeVietnameseAccents, tokenizeWords } from '../utils/text';

/**
 * ============================================================================
 * DỮ LIỆU MẪU (MOCK DATA) CHO ĐỒ ÁN NGHIÊN CỨU KHOA HỌC:
 * "Hệ thống khuyến nghị sách tiếng Việt"
 *
 * Chú thích kiến trúc:
 * Toàn bộ tập dữ liệu mẫu và các thuật toán gợi ý bên dưới phục vụ chạy thử nghiệm
 * giao diện khi chưa khởi động backend Python. Khi backend Python triển khai xong,
 * chỉ cần cấu hình biến môi trường VITE_API_BASE_URL để chuyển sang API thật.
 * ============================================================================
 */
export const MOCK_BOOKS: Book[] = [
  // 1. Kiếm tiền & Đầu tư / Khởi nghiệp
  {
    id: 'b-01',
    title: 'Dạy con làm giàu - Tập 1: Cha giàu cha nghèo',
    authors: ['Robert Kiyosaki'],
    genres: ['kiem_tien_dau_tu'],
    description: 'Cuốn sách vỡ lòng về tư duy tài chính cá nhân, phân biệt rõ rệt giữa tài sản và tiêu sản. Giúp người đọc thay đổi hoàn toàn cách nhìn nhận về tiền bạc và con đường tự do tài chính.',
    year: 2000,
    publisher: 'NXB Trẻ',
    page_count: 320,
    isbn: '978-604-1-08920-5',
    rating: 4.8,
  },
  {
    id: 'b-02',
    title: 'Dạy con làm giàu - Tập 2: Sử dụng đồng vốn',
    authors: ['Robert Kiyosaki'],
    genres: ['kiem_tien_dau_tu', 'khoi_nghiep_kinh_doanh'],
    description: 'Phân tích chi tiết mô hình Kim Tứ Đồ nổi tiếng: người làm công, người làm tư, chủ doanh nghiệp và nhà đầu tư. Hướng dẫn lộ trình dịch chuyển tư duy để làm chủ nguồn thu nhập thụ động bền vững.',
    year: 2002,
    publisher: 'NXB Trẻ',
    page_count: 380,
    isbn: '978-604-1-08921-2',
    rating: 4.6,
  },
  {
    id: 'b-03',
    title: 'Tâm lý học về tiền',
    authors: ['Morgan Housel'],
    genres: ['kiem_tien_dau_tu', 'tam_ly_suc_khoe'],
    description: 'Những bài học vượt thời gian về sự giàu có, lòng tham và hạnh phúc thông qua 19 câu chuyện ngắn thú vị. Tác giả chứng minh rằng thành công tài chính phụ thuộc vào hành vi và cảm xúc nhiều hơn là công thức toán học.',
    year: 2021,
    publisher: 'NXB Thế Giới',
    page_count: 384,
    isbn: '978-604-77-9411-9',
    rating: 4.9,
  },
  {
    id: 'b-04',
    title: 'Nhà đầu tư thông minh',
    authors: ['Benjamin Graham'],
    genres: ['kiem_tien_dau_tu'],
    description: 'Tác phẩm kinh điển về đầu tư giá trị được Warren Buffett ca ngợi là cuốn sách hay nhất về đầu tư từng được viết. Cung cấp triết lý quản trị rủi ro và cách tìm kiếm biên an toàn trên thị trường chứng khoán.',
    year: 2018,
    publisher: 'NXB Trẻ',
    page_count: 640,
    isbn: '978-604-1-12401-2',
    rating: 4.7,
  },
  {
    id: 'b-05',
    title: 'Người giàu có nhất thành Babylon',
    authors: ['George S. Clason'],
    genres: ['kiem_tien_dau_tu'],
    description: 'Tập hợp những câu chuyện ngụ ngôn cổ xưa tại vương quốc Babylon phồn hoa với những bài học tiết kiệm và tích lũy vàng mười. Cuốn sách cung cấp 7 phương thuốc chữa trị một túi tiền lép kẹp vô cùng thực tế.',
    year: 2019,
    publisher: 'NXB Tổng hợp TP.HCM',
    page_count: 216,
    isbn: '978-604-58-9412-3',
    rating: 4.7,
  },
  {
    id: 'b-06',
    title: '$100M Offers - Chào hàng không thể chối từ',
    authors: ['Alex Hormozi'],
    genres: ['khoi_nghiep_kinh_doanh', 'kiem_tien_dau_tu'],
    description: 'Cẩm nang thực chiến giúp các nhà khởi nghiệp và kinh doanh tạo ra những gói sản phẩm có giá trị cao đến mức khách hàng cảm thấy ngớ ngẩn nếu từ chối. Đi sâu vào phương trình giá trị, định giá và tiếp thị chuyển đổi.',
    year: 2023,
    publisher: 'NXB Lao Động',
    page_count: 280,
    isbn: '978-604-59-1200-8',
    rating: 4.9,
  },

  // 2. Khởi nghiệp & Kinh doanh
  {
    id: 'b-07',
    title: 'Khởi nghiệp tinh gọn (The Lean Startup)',
    authors: ['Eric Ries'],
    genres: ['khoi_nghiep_kinh_doanh'],
    description: 'Phương pháp luận cách mạng áp dụng quy trình Xây dựng - Đo lường - Học hỏi để giảm thiểu lãng phí và kiểm chứng giả thuyết sản phẩm. Cuốn sách gối đầu giường cho các nhà sáng lập startup trong thời đại biến động.',
    year: 2013,
    publisher: 'NXB Tổng hợp TP.HCM',
    page_count: 360,
    isbn: '978-604-58-1201-9',
    rating: 4.6,
  },
  {
    id: 'b-08',
    title: 'Từ không đến một (Zero to One)',
    authors: ['Peter Thiel', 'Blake Masters'],
    genres: ['khoi_nghiep_kinh_doanh', 'hoc_lap_trinh_cong_nghe'],
    description: 'Cách xây dựng tương lai thông qua sự độc quyền sáng tạo và công nghệ đột phá thay vì cạnh tranh vụn vặt. Peter Thiel chia sẻ những bí mật phản trực giác về khởi nghiệp và tầm nhìn công nghệ dài hạn.',
    year: 2014,
    publisher: 'NXB Trẻ',
    page_count: 248,
    isbn: '978-604-1-05112-7',
    rating: 4.8,
  },
  {
    id: 'b-09',
    title: 'Gã nghiện giày (Shoe Dog)',
    authors: ['Phil Knight'],
    genres: ['khoi_nghiep_kinh_doanh', 'van_hoc'],
    description: 'Hồi ký chân thực và xúc động của nhà sáng lập tập đoàn Nike về hành trình vượt qua hàng loạt nguy cơ phá sản. Tác phẩm truyền cảm hứng mãnh liệt về lòng kiên định, sự mạo hiểm và khát vọng chinh phục ước mơ.',
    year: 2017,
    publisher: 'NXB Thế Giới',
    page_count: 520,
    isbn: '978-604-77-3801-4',
    rating: 4.9,
  },

  // 3. Lập trình & Công nghệ
  {
    id: 'b-10',
    title: 'Clean Code - Mã sạch và nghệ thuật viết code chuyên nghiệp',
    authors: ['Robert C. Martin'],
    genres: ['hoc_lap_trinh_cong_nghe'],
    description: 'Cẩm nang bắt buộc cho mọi kỹ sư phần mềm muốn nâng cao tay nghề và tư duy viết code dễ bảo trì. Hướng dẫn chi tiết cách đặt tên hàm, tổ chức module, xử lý lỗi và tái cấu trúc mã nguồn tối ưu.',
    year: 2016,
    publisher: 'NXB Thông tin và Truyền thông',
    page_count: 464,
    isbn: '978-604-80-2101-8',
    rating: 4.9,
  },
  {
    id: 'b-11',
    title: 'Lập trình viên thực dụng (The Pragmatic Programmer)',
    authors: ['Andrew Hunt', 'David Thomas'],
    genres: ['hoc_lap_trinh_cong_nghe'],
    description: 'Bộ sưu tập những lời khuyên sâu sắc và triết lý làm nghề phần mềm từ các chuyên gia kỳ cựu. Giúp bạn chuyển từ việc chỉ gõ lệnh sang tư duy kiến trúc sư hệ thống thực thụ và linh hoạt.',
    year: 2020,
    publisher: 'NXB Khoa học và Kỹ thuật',
    page_count: 352,
    isbn: '978-604-67-1502-3',
    rating: 4.8,
  },
  {
    id: 'b-12',
    title: 'Tự học lập trình Python cấp tốc',
    authors: ['Eric Matthes'],
    genres: ['hoc_lap_trinh_cong_nghe'],
    description: 'Giáo trình thực hành toàn diện từ căn bản đến nâng cao với ngôn ngữ Python, phân tích dữ liệu và web. Phần hai hướng dẫn xây dựng 3 dự án thực tế gồm game bắn tàu vũ trụ, web Django và trực quan hóa dữ liệu.',
    year: 2021,
    publisher: 'NXB Dân Trí',
    page_count: 560,
    isbn: '978-604-88-8910-1',
    rating: 4.7,
  },
  {
    id: 'b-13',
    title: 'Thiết kế các ứng dụng chuyên sâu về dữ liệu (Designing Data-Intensive Applications)',
    authors: ['Martin Kleppmann'],
    genres: ['hoc_lap_trinh_cong_nghe', 'khoa_hoc_lich_su'],
    description: 'Khảo sát sâu sắc về các nguyên lý kiến trúc hệ thống phân tán, cơ sở dữ liệu NoSQL, streaming và sự nhất quán dữ liệu. Một trong những cuốn sách kỹ thuật giá trị nhất của thế kỷ 21 cho kỹ sư backend và AI.',
    year: 2022,
    publisher: 'NXB Bách Khoa Hà Nội',
    page_count: 616,
    isbn: '978-604-95-0211-4',
    rating: null, // Kiểm tra hiển thị rating: null -> không được hiện 0 sao
  },

  // 4. Phát triển bản thân
  {
    id: 'b-14',
    title: 'Nguyên tử thói quen (Atomic Habits)',
    authors: ['James Clear'],
    genres: ['phat_trien_ban_than'],
    description: 'Khám phá bí mật tạo nên thay đổi phi thường từ những thói quen nhỏ chỉ 1% mỗi ngày. Cung cấp khung 4 bước khoa học: Làm cho rõ ràng, Hấp dẫn, Dễ dàng và Thỏa mãn để làm chủ kỷ luật cá nhân.',
    year: 2019,
    publisher: 'NXB Thế Giới',
    page_count: 388,
    isbn: '978-604-77-6512-6',
    rating: 4.9,
  },
  {
    id: 'b-15',
    title: 'Làm ra làm, chơi ra chơi (Deep Work)',
    authors: ['Cal Newport'],
    genres: ['phat_trien_ban_than'],
    description: 'Rèn luyện khả năng tập trung sâu sắc không bị phân tâm trong một thế giới tràn ngập thông báo và mạng xã hội. Tác giả chứng minh Deep Work là siêu năng lực cạnh tranh quyết định của nền kinh tế tri thức mới.',
    year: 2017,
    publisher: 'NXB Lao Động Xã Hội',
    page_count: 320,
    isbn: '978-604-65-2981-1',
    rating: 4.7,
  },
  {
    id: 'b-16',
    title: '7 thói quen của người thành đạt',
    authors: ['Stephen R. Covey'],
    genres: ['phat_trien_ban_than', 'giao_tiep_lanh_dao'],
    description: 'Triết lý nền tảng giúp bạn chuyển từ trạng thái phụ thuộc sang độc lập và tương thuộc hiệu quả. Hướng dẫn cách ưu tiên điều quan trọng nhất, tư duy cùng thắng và không ngừng mài sắc bản thân.',
    year: 2015,
    publisher: 'NXB Tổng hợp TP.HCM',
    page_count: 480,
    isbn: '978-604-58-3901-7',
    rating: 4.8,
  },
  {
    id: 'b-17',
    title: 'Để hiệu quả trong công việc (Eat That Frog!)',
    authors: ['Brian Tracy'],
    genres: ['phat_trien_ban_than'],
    description: '21 nguyên tắc tuyệt vời giúp bạn vượt qua tính trì hoãn và hoàn thành những nhiệm vụ khó khăn nhất trước tiên. Giúp bạn quản lý thời gian thông minh và gia tăng năng suất gấp bội trong công việc hàng ngày.',
    year: 2018,
    publisher: 'NXB Dân Trí',
    page_count: 184,
    isbn: '978-604-88-4501-5',
    rating: 4.5,
  },
  {
    id: 'b-18',
    title: 'Nghệ thuật tinh tế của việc đếch quan tâm',
    authors: ['Mark Manson'],
    genres: ['phat_trien_ban_than', 'tam_ly_suc_khoe'],
    description: 'Một góc nhìn thẳng thắn, hài hước và thực tế chống lại sự tích cực độc hại trong văn hóa hiện đại. Hướng dẫn bạn chọn lọc những điều thực sự quan trọng để bận tâm và chấp nhận những nghịch cảnh tự nhiên của đời sống.',
    year: 2018,
    publisher: 'NXB Thế Giới',
    page_count: 328,
    isbn: '978-604-77-5120-4',
    rating: 4.6,
  },

  // 5. Giao tiếp & Lãnh đạo
  {
    id: 'b-19',
    title: 'Đắc nhân tâm',
    authors: ['Dale Carnegie'],
    genres: ['giao_tiep_lanh_dao', 'phat_trien_ban_than'],
    description: 'Cuốn sách nghệ thuật ứng xử nổi tiếng nhất thế giới với hàng triệu bản được tiêu thụ qua nhiều thế hệ. Cung cấp những bài học sâu sắc về sự thấu hiểu, chân thành, lắng nghe và truyền cảm hứng cho người khác.',
    year: 2016,
    publisher: 'NXB Trẻ',
    page_count: 320,
    isbn: '978-604-1-08102-5',
    rating: 4.8,
  },
  {
    id: 'b-20',
    title: 'Bắt đầu với câu hỏi Tại sao (Start With Why)',
    authors: ['Simon Sinek'],
    genres: ['giao_tiep_lanh_dao', 'khoi_nghiep_kinh_doanh'],
    description: 'Khám phá mô hình Vòng tròn Vàng lý giải vì sao những nhà lãnh đạo vĩ đại như Steve Jobs hay Martin Luther King có thể tạo ra làn sóng ảnh hưởng to lớn. Sức mạnh của việc thấu suốt mục đích cốt lõi trước khi hành động.',
    year: 2017,
    publisher: 'NXB Trẻ',
    page_count: 340,
    isbn: '978-604-1-10512-7',
    rating: 4.7,
  },
  {
    id: 'b-21',
    title: 'Nghệ thuật đàm phán đỉnh cao (Never Split the Difference)',
    authors: ['Chris Voss', 'Tahl Raz'],
    genres: ['giao_tiep_lanh_dao'],
    description: 'Bí quyết đàm phán tâm lý thực chiến được đúc kết từ cựu chuyên gia đàm phán con tin hàng đầu của FBI. Hướng dẫn kỹ thuật lắng nghe chiến thuật, đặt câu hỏi hiệu chỉnh và thấu cảm sâu sắc trong mọi cuộc thương thảo.',
    year: 2020,
    publisher: 'NXB Lao Động',
    page_count: 380,
    isbn: '978-604-59-9912-2',
    rating: 4.8,
  },

  // 6. Tâm lý & Sức khỏe
  {
    id: 'b-22',
    title: 'Quẳng gánh lo đi và vui sống',
    authors: ['Dale Carnegie'],
    genres: ['tam_ly_suc_khoe', 'phat_trien_ban_than'],
    description: 'Cẩm nang phân tích nguyên nhân của sự âu lo và cung cấp các phương pháp cụ thể để giải tỏa căng thẳng tâm trí. Giúp người đọc sống trọn vẹn trong ngăn kín của ngày hôm nay và tìm lại sự bình yên nội tâm.',
    year: 2016,
    publisher: 'NXB Trẻ',
    page_count: 348,
    isbn: '978-604-1-08103-2',
    rating: 4.7,
  },
  {
    id: 'b-23',
    title: 'Tư duy nhanh và chậm (Thinking, Fast and Slow)',
    authors: ['Daniel Kahneman'],
    genres: ['tam_ly_suc_khoe', 'khoa_hoc_lich_su'],
    description: 'Công trình kinh điển đoạt giải Nobel kinh tế giải mã hai hệ thống vận hành trí não: Hệ thống 1 trực giác và Hệ thống 2 logic. Tiết lộ những thiên kiến nhận thức ngầm định chi phối mọi quyết định trong cuộc sống.',
    year: 2015,
    publisher: 'NXB Thế Giới',
    page_count: 612,
    isbn: '978-604-77-1601-2',
    rating: 4.8,
  },
  {
    id: 'b-24',
    title: 'Sao chúng ta lại ngủ (Why We Sleep)',
    authors: ['Matthew Walker'],
    genres: ['tam_ly_suc_khoe', 'khoa_hoc_lich_su'],
    description: 'Nghiên cứu khoa học thần kinh tiên phong giải mã sức mạnh phục hồi kỳ diệu của giấc ngủ đối với trí nhớ, hệ miễn dịch và tuổi thọ. Khám phá lý do vì sao thiếu ngủ là nguồn cơn của nhiều căn bệnh thời hiện đại.',
    year: 2020,
    publisher: 'NXB Dân Trí',
    page_count: 488,
    isbn: '978-604-88-9210-1',
    rating: 4.8,
  },
  {
    id: 'b-25',
    title: 'Phép lạ của sự tỉnh thức',
    authors: ['Thích Nhất Hạnh'],
    genres: ['tam_ly_suc_khoe'],
    description: 'Những lời dạy mộc mạc mà thấm đượm tuệ giác về chánh niệm trong từng hơi thở, bước chân và hành động thường nhật. Giúp bạn chuyển hóa lo âu muộn phiền để an trú trọn vẹn trong giây phút hiện tại màu nhiệm.',
    year: 2014,
    publisher: 'NXB Tôn Giáo',
    page_count: 160,
    isbn: '978-604-61-1201-3',
    rating: 4.9,
  },
  {
    id: 'b-26',
    title: 'Khi hơi thở hóa thinh không',
    authors: ['Paul Kalanithi'],
    genres: ['tam_ly_suc_khoe', 'van_hoc'],
    description: 'Tự truyện đầy xúc động của một bác sĩ phẫu thuật thần kinh tài năng đối diện với căn bệnh ung thư phổi giai đoạn cuối. Cuốn sách là bản trường ca tuyệt đẹp về ý nghĩa cuộc đời, tình yêu và cái chết.',
    year: 2017,
    publisher: 'NXB Hội Nhà Văn',
    page_count: 240,
    isbn: '978-604-53-7801-4',
    rating: 4.9,
  },

  // 7. Học ngoại ngữ
  {
    id: 'b-27',
    title: 'Luyện nói tiếng Anh như người bản xứ (Effortless English)',
    authors: ['A.J. Hoge'],
    genres: ['hoc_ngoai_ngu'],
    description: 'Phương pháp học tiếng Anh tự nhiên 7 quy tắc giúp người học phản xạ giao tiếp trôi chảy mà không cần ghi nhớ ngữ pháp khô khan. Nhấn mạnh kỹ năng nghe chủ động và lặp lại theo ngữ cảnh thực tế.',
    year: 2018,
    publisher: 'NXB Dân Trí',
    page_count: 312,
    isbn: '978-604-88-6102-2',
    rating: 4.6,
  },
  {
    id: 'b-28',
    title: 'English Grammar in Use (Bản dịch & giải thích tiếng Việt)',
    authors: ['Raymond Murphy'],
    genres: ['hoc_ngoai_ngu'],
    description: 'Bộ tài liệu ngữ pháp tiếng Anh kinh điển và uy tín nhất toàn cầu cho học viên trình độ trung cấp. Cấu trúc bài học rõ ràng với lý thuyết cô đọng ở trang trái và bài tập thực hành ứng dụng ngay ở trang đối diện.',
    year: 2019,
    publisher: 'NXB Đại học Quốc gia',
    page_count: 390,
    isbn: '978-604-62-9812-1',
    rating: 4.9,
  },
  {
    id: 'b-29',
    title: 'Chiến thuật chinh phục từ vựng IELTS đỉnh cao',
    authors: ['Vũ Mai Phương'],
    genres: ['hoc_ngoai_ngu'],
    description: 'Hệ thống từ vựng học thuật theo các chủ đề trọng điểm thường xuất hiện trong đề thi IELTS gần đây. Kết hợp phương pháp ghi nhớ qua ngữ cảnh bài đọc và bài nghe giúp học viên bứt phá điểm số nhanh chóng.',
    year: 2022,
    publisher: 'NXB Hồng Đức',
    page_count: 336,
    isbn: '978-604-99-4211-8',
    rating: null, // Kiểm tra null rating
  },

  // 8. Văn học
  {
    id: 'b-30',
    title: 'Mắt biếc',
    authors: ['Nguyễn Nhật Ánh'],
    genres: ['van_hoc'],
    description: 'Bản tình ca da diết, mộc mạc và hoài niệm về mối tình đơn phương của thầy giáo Ngạn dành cho cô bạn thời thơ ấu Hà Lan. Ngôn từ dịu dàng đưa độc giả trở về làng Đo Đo thanh bình với những rung động đầu đời trong trẻo.',
    year: 1990,
    publisher: 'NXB Trẻ',
    page_count: 300,
    isbn: '978-604-1-03201-0',
    rating: 4.8,
  },
  {
    id: 'b-31',
    title: 'Chí Phèo và các truyện ngắn chọn lọc',
    authors: ['Nam Cao'],
    genres: ['van_hoc'],
    description: 'Đỉnh cao của văn học hiện thực phê phán Việt Nam trước năm 1945 phản ánh bi kịch bị tha hóa của người nông dân nghèo. Khát khao lương thiện cháy bỏng của Chí Phèo vẫn là câu hỏi nhân văn vang vọng mãi với thời gian.',
    year: 2016,
    publisher: 'NXB Văn Học',
    page_count: 280,
    isbn: '978-604-69-8201-2',
    rating: 4.7,
  },
  {
    id: 'b-32',
    title: 'Số đỏ',
    authors: ['Vũ Trọng Phụng'],
    genres: ['van_hoc'],
    description: 'Kiệt tác trào phúng bậc nhất về cuộc phiêu lưu đổi đời kỳ quặc của anh chàng lừa đảo Xuân Tóc Đỏ giữa xã hội thượng lưu nửa mùa. Bức tranh trào lộng cay đắng vạch trần những thói giả dối, lố lăng của phong trào Âu hóa.',
    year: 2018,
    publisher: 'NXB Văn Học',
    page_count: 260,
    isbn: '978-604-69-9501-2',
    rating: 4.8,
  },

  // 9. Khoa học & Lịch sử
  {
    id: 'b-33',
    title: 'Sapiens: Lược sử loài người',
    authors: ['Yuval Noah Harari'],
    genres: ['khoa_hoc_lich_su'],
    description: 'Góc nhìn sử học đột phá về cách một loài vượn người vô danh vươn lên thống trị hành tinh nhờ năng lực tưởng tượng tập thể. Khám phá ba cuộc cách mạng trọng đại: Nhận thức, Nông nghiệp và Khoa học.',
    year: 2017,
    publisher: 'NXB Tri Thức',
    page_count: 560,
    isbn: '978-604-90-8802-1',
    rating: 4.9,
  },
  {
    id: 'b-34',
    title: 'Homo Deus: Lược sử tương lai',
    authors: ['Yuval Noah Harari'],
    genres: ['khoa_hoc_lich_su', 'hoc_lap_trinh_cong_nghe'],
    description: 'Dự báo táo bạo về số phận của nhân loại khi công nghệ sinh học và trí tuệ nhân tạo phát triển tới điểm kỳ dị. Liệu con người có thể nâng cấp chính mình thành những thực thể thần thánh và điều gì sẽ thay thế chủ nghĩa nhân văn?',
    year: 2018,
    publisher: 'NXB Thế Giới',
    page_count: 512,
    isbn: '978-604-77-4902-7',
    rating: 4.7,
  },
  {
    id: 'b-35',
    title: 'Lược sử thời gian',
    authors: ['Stephen Hawking'],
    genres: ['khoa_hoc_lich_su'],
    description: 'Tuyệt tác phổ biến vật lý thiên văn giải thích nguồn gốc vũ trụ, lỗ đen và lý thuyết dây một cách giản dị, dễ hiểu. Tác giả dẫn dắt bạn qua những giới hạn xa xôi nhất của không gian và thời gian.',
    year: 2015,
    publisher: 'NXB Trẻ',
    page_count: 296,
    isbn: '978-604-1-06781-4',
    rating: 4.8,
  },

  // 10. Thiếu nhi
  {
    id: 'b-36',
    title: 'Cho tôi xin một vé đi tuổi thơ',
    authors: ['Nguyễn Nhật Ánh'],
    genres: ['thieu_nhi', 'van_hoc'],
    description: 'Tấm vé kỳ diệu đưa người lớn ngược dòng thời gian về lại thế giới hồn nhiên, nghịch ngợm của cu Mùi, cái Tí, Hải cò. Tác phẩm ấm áp nhắc nhở chúng ta trân trọng sự ngây thơ và tình bạn thuần khiết.',
    year: 2008,
    publisher: 'NXB Trẻ',
    page_count: 220,
    isbn: '978-604-1-00214-3',
    rating: 4.9,
  },
  {
    id: 'b-37',
    title: 'Tôi thấy hoa vàng trên cỏ xanh',
    authors: ['Nguyễn Nhật Ánh'],
    genres: ['thieu_nhi', 'van_hoc'],
    description: 'Bức tranh đồng quê miền Trung êm đềm với những câu chuyện tình anh em, tình làng nghĩa xóm và tuổi thơ nghèo khó. Khơi gợi những rung cảm nhẹ nhàng, sâu lắng về lòng bao dung và sự trưởng thành.',
    year: 2010,
    publisher: 'NXB Trẻ',
    page_count: 378,
    isbn: '978-604-1-00982-1',
    rating: 4.8,
  },
  {
    id: 'b-38',
    title: 'Dế Mèn phiêu lưu ký',
    authors: ['Tô Hoài'],
    genres: ['thieu_nhi'],
    description: 'Tác phẩm văn học thiếu nhi kinh điển nhất Việt Nam kể về hành trình chu du bốn bể đầy quả cảm của chú Dế Mèn kiêu hãnh. Bài học sâu sắc về tình bạn bè, tinh thần đoàn kết và lý tưởng hòa bình thế giới muôn loài.',
    year: 2019,
    publisher: 'NXB Kim Đồng',
    page_count: 196,
    isbn: '978-604-2-13201-5',
    rating: 4.8,
  },
  {
    id: 'b-39',
    title: 'Hoàng tử bé (Le Petit Prince)',
    authors: ['Antoine de Saint-Exupéry'],
    genres: ['thieu_nhi', 'van_hoc'],
    description: 'Câu chuyện ngụ ngôn giàu chất thơ về tình yêu, trách nhiệm và cách nhìn nhận thế giới bằng trái tim thay vì đôi mắt. Bông hồng duy nhất và chú cáo nhỏ đã trở thành biểu tượng bất tử cho sự gắn kết tâm hồn.',
    year: 2017,
    publisher: 'NXB Kim Đồng',
    page_count: 110,
    isbn: '978-604-2-08912-8',
    rating: 4.9,
  },
];

/**
 * Quản lý lịch sử xem trong localStorage cho mô phỏng
 */
function getViewStorageKey(userId: string): string {
  return `bookrec_views_${userId}`;
}

export function getMockViewHistory(userId: string): Record<string, number> {
  try {
    const raw = localStorage.getItem(getViewStorageKey(userId));
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveMockViewHistory(userId: string, history: Record<string, number>): void {
  try {
    localStorage.setItem(getViewStorageKey(userId), JSON.stringify(history));
  } catch {
    // Dự phòng
  }
}

/**
 * ============================================================================
 * CÁC HÀM XỬ LÝ MÔ PHỎNG (MOCK API FUNCTIONS)
 * ============================================================================
 */

export async function mockGetGenres(): Promise<Genre[]> {
  const counts: Record<string, number> = {};
  for (const book of MOCK_BOOKS) {
    for (const g of book.genres) {
      counts[g] = (counts[g] || 0) + 1;
    }
  }

  return Object.entries(GENRES_MAP).map(([id, name]) => ({
    id,
    name,
    book_count: counts[id] || 0,
  }));
}

export async function mockGetAuthors(q?: string): Promise<Author[]> {
  const counts: Record<string, number> = {};
  for (const book of MOCK_BOOKS) {
    for (const author of book.authors) {
      counts[author] = (counts[author] || 0) + 1;
    }
  }

  let authors = Object.entries(counts).map(([name, book_count]) => ({
    name,
    book_count,
  }));

  if (q && q.trim()) {
    const normalizedQ = removeVietnameseAccents(q);
    authors = authors.filter(a => removeVietnameseAccents(a.name).includes(normalizedQ));
  }

  return authors.sort((a, b) => b.book_count - a.book_count || a.name.localeCompare(b.name));
}

export async function mockGetBooks(params: BookListParams = {}): Promise<BookListResponse> {
  const {
    genre,
    author,
    q,
    sort = 'title_asc',
    page = 1,
    page_size = 12,
  } = params;

  let filtered = [...MOCK_BOOKS];

  if (genre) {
    filtered = filtered.filter(b => b.genres.includes(genre));
  }

  if (author) {
    const normalizedAuthor = removeVietnameseAccents(author);
    filtered = filtered.filter(b =>
      b.authors.some(a => removeVietnameseAccents(a).includes(normalizedAuthor))
    );
  }

  if (q && q.trim()) {
    const normalizedQ = removeVietnameseAccents(q);
    filtered = filtered.filter(b => {
      const matchTitle = removeVietnameseAccents(b.title).includes(normalizedQ);
      const matchAuthor = b.authors.some(a => removeVietnameseAccents(a).includes(normalizedQ));
      const matchDesc = removeVietnameseAccents(b.description).includes(normalizedQ);
      return matchTitle || matchAuthor || matchDesc;
    });
  }

  // Sắp xếp
  if (sort === 'title_asc') {
    filtered.sort((a, b) => a.title.localeCompare(b.title, 'vi'));
  } else if (sort === 'year_desc') {
    filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
  } else if (sort === 'year_asc') {
    filtered.sort((a, b) => (a.year || 9999) - (b.year || 9999));
  }

  const total = filtered.length;
  const start = (page - 1) * page_size;
  const items = filtered.slice(start, start + page_size);

  return {
    items,
    total,
    page,
    page_size,
  };
}

export async function mockGetBookById(id: string): Promise<Book> {
  const book = MOCK_BOOKS.find(b => b.id === id);
  if (!book) {
    throw new Error(`Không tìm thấy cuốn sách với mã "${id}"`);
  }
  return book;
}

export async function mockGetSimilarBooks(id: string, limit = 6): Promise<Book[]> {
  const target = MOCK_BOOKS.find(b => b.id === id);
  if (!target) return [];

  const others = MOCK_BOOKS.filter(b => b.id !== id);

  const scored = others.map(book => {
    let score = 0;
    // Cùng tác giả: cộng 4 điểm
    const sameAuthor = book.authors.some(a => target.authors.includes(a));
    if (sameAuthor) score += 4;

    // Cùng thể loại: mỗi thể loại trùng cộng 2 điểm
    const sharedGenres = book.genres.filter(g => target.genres.includes(g)).length;
    score += sharedGenres * 2;

    return { book, score };
  });

  scored.sort((a, b) => b.score - a.score || (b.book.rating || 0) - (a.book.rating || 0));
  return scored.slice(0, limit).map(s => s.book);
}

export async function mockRecordBookView(userId: string, bookId: string): Promise<ViewResponse> {
  const history = getMockViewHistory(userId);
  const currentCount = (history[bookId] || 0) + 1;
  history[bookId] = currentCount;
  saveMockViewHistory(userId, history);
  return { ok: true, view_count: currentCount };
}

/**
 * Gợi ý theo lịch sử xem:
 * Mỗi cuốn có từ min_views (mặc định 3) trở lên:
 * Lấy các sách cùng thể loại hoặc cùng tác giả (bỏ chính cuốn đó và các cuốn đã xem nhiều)
 */
export async function mockGetViewedRecommendations(
  userId: string,
  minViews = MIN_VIEWS,
  limit = 8
): Promise<ViewedRecommendationsResponse> {
  const history = getMockViewHistory(userId);
  const viewedBookIds = Object.keys(history);

  // Lọc ra các cuốn sách đã xem >= minViews
  const qualifyingBookIds = viewedBookIds.filter(id => (history[id] || 0) >= minViews);

  if (qualifyingBookIds.length === 0) {
    return { sections: [] };
  }

  const sections: ViewedRecommendationsResponse['sections'] = [];

  for (const bookId of qualifyingBookIds) {
    const baseBook = MOCK_BOOKS.find(b => b.id === bookId);
    if (!baseBook) continue;

    const viewCount = history[bookId];

    // Lấy sách tương tự cùng thể loại hoặc cùng tác giả
    const candidateBooks = MOCK_BOOKS.filter(b => {
      if (b.id === bookId) return false;
      const sameAuthor = b.authors.some(a => baseBook.authors.includes(a));
      const sharedGenres = b.genres.some(g => baseBook.genres.includes(g));
      return sameAuthor || sharedGenres;
    });

    // Ưu tiên sách có cùng tác giả và thể loại, tránh lặp lại các cuốn đã xem nhiều lần
    const scoredCandidates = candidateBooks.map(b => {
      let score = 0;
      if (b.authors.some(a => baseBook.authors.includes(a))) score += 5;
      score += b.genres.filter(g => baseBook.genres.includes(g)).length * 3;
      // Phạt nhẹ nếu đã xem cuốn này rồi để đa dạng hóa
      const views = history[b.id] || 0;
      score -= Math.min(views, 4);
      return { book: b, score };
    });

    scoredCandidates.sort((a, b) => b.score - a.score || (b.book.rating || 0) - (a.book.rating || 0));
    const items = scoredCandidates.slice(0, limit).map(c => c.book);

    if (items.length > 0) {
      sections.push({
        based_on: baseBook,
        view_count: viewCount,
        items,
      });
    }
  }

  // Sắp xếp các section: cuốn nào được xem nhiều nhất xếp lên trước
  sections.sort((a, b) => b.view_count - a.view_count);

  return { sections };
}

/**
 * Bản đồ đối chiếu từ khóa sang thể loại phục vụ tìm kiếm theo mục tiêu
 * Chú thích: Ở backend Python thực tế của đồ án, chức năng này sẽ sử dụng
 * mô hình embedding ngữ nghĩa (như text-embedding hoặc multilingual SBERT)
 * kết hợp tìm kiếm vector tương đồng (FAISS / Cosine Similarity).
 */
const GOAL_KEYWORDS_MAP: Record<string, { genreId: string; boostKeywords: string[] }> = {
  // Kiếm tiền & đầu tư
  'kiem tien': { genreId: 'kiem_tien_dau_tu', boostKeywords: ['dau tu', 'tai chinh', 'lam giau', 'tien bac', 'tiet kiem', 'chung khoan', 'dong von'] },
  'dau tu': { genreId: 'kiem_tien_dau_tu', boostKeywords: ['kiem tien', 'chung khoan', 'tai san', 'tai chinh', 'gia tri'] },
  'lam giau': { genreId: 'kiem_tien_dau_tu', boostKeywords: ['kiem tien', 'tu do tai chinh', 'dong von', 'gia dinh'] },
  'tai chinh': { genreId: 'kiem_tien_dau_tu', boostKeywords: ['kiem tien', 'dau tu', 'ngan sach', 'quan ly tien'] },

  // Khởi nghiệp & kinh doanh
  'khoi nghiep': { genreId: 'khoi_nghiep_kinh_doanh', boostKeywords: ['startup', 'kinh doanh', 'sang lap', 'san pham', 'y tuong'] },
  'kinh doanh': { genreId: 'khoi_nghiep_kinh_doanh', boostKeywords: ['ban hang', 'marketing', 'khach hang', 'doanh nghiep', 'chien luoc'] },
  'startup': { genreId: 'khoi_nghiep_kinh_doanh', boostKeywords: ['tinh gon', 'tang truong', 'goi von', 'cong nghe'] },
  'ban hang': { genreId: 'khoi_nghiep_kinh_doanh', boostKeywords: ['dam phan', 'chao hang', 'khach hang', 'doanh thu'] },

  // Lập trình & công nghệ
  'hoc code': { genreId: 'hoc_lap_trinh_cong_nghe', boostKeywords: ['lap trinh', 'python', 'clean code', 'phan mem', 'developer'] },
  'lap trinh': { genreId: 'hoc_lap_trinh_cong_nghe', boostKeywords: ['code', 'python', 'backend', 'phan mem', 'kien truc'] },
  'hoc lap trinh': { genreId: 'hoc_lap_trinh_cong_nghe', boostKeywords: ['code', 'python', 'thuc hanh', 'cong nghe'] },
  'python': { genreId: 'hoc_lap_trinh_cong_nghe', boostKeywords: ['lap trinh', 'du lieu', 'code', 'tri tue nhan tao'] },
  'cong nghe': { genreId: 'hoc_lap_trinh_cong_nghe', boostKeywords: ['tri tue nhan tao', 'du lieu', 'phan mem', 'tuong lai'] },

  // Phát triển bản thân
  'phat trien ban than': { genreId: 'phat_trien_ban_than', boostKeywords: ['thoi quen', 'ky luat', 'tap trung', 'nang suat', 'thanh cong'] },
  'thoi quen': { genreId: 'phat_trien_ban_than', boostKeywords: ['ky luat', 'nguyen tu', 'hang ngay', 'nang suat'] },
  'quan ly thoi gian': { genreId: 'phat_trien_ban_than', boostKeywords: ['nang suat', 'tri hoan', 'tap trung', 'hieu qua'] },
  'tap trung': { genreId: 'phat_trien_ban_than', boostKeywords: ['deep work', 'nang suat', 'hieu qua', 'tam tri'] },
  'ky luat': { genreId: 'phat_trien_ban_than', boostKeywords: ['thoi quen', 'y chi', 'muc tieu', 'phat trien'] },

  // Giao tiếp & lãnh đạo
  'giao tiep': { genreId: 'giao_tiep_lanh_dao', boostKeywords: ['ung xu', 'thuyet phuc', 'lang nghe', 'dac nhan tam', 'ket noi'] },
  'lanh dao': { genreId: 'giao_tiep_lanh_dao', boostKeywords: ['tai sao', 'truyen cam hung', 'doi ngu', 'quan ly'] },
  'thuyet phuc': { genreId: 'giao_tiep_lanh_dao', boostKeywords: ['dam phan', 'giao tiep', 'ung xu', 'tam ly'] },
  'dam phan': { genreId: 'giao_tiep_lanh_dao', boostKeywords: ['thuong luong', 'thoa thuan', 'tam ly', 'giao tiep'] },

  // Tâm lý & sức khỏe
  'tam ly': { genreId: 'tam_ly_suc_khoe', boostKeywords: ['cam xuc', 'hanh phuc', 'tu duy', 'nao bo', 'chua lanh'] },
  'suc khoe': { genreId: 'tam_ly_suc_khoe', boostKeywords: ['giac ngu', 'tinh than', 'phuc hoi', 'lo au'] },
  'chua lanh': { genreId: 'tam_ly_suc_khoe', boostKeywords: ['tinh thuc', 'binh yen', 'thien', 'lo au'] },
  'giam stress': { genreId: 'tam_ly_suc_khoe', boostKeywords: ['lo au', 'vui song', 'binh an', 'tinh thuc'] },
  'ngu ngon': { genreId: 'tam_ly_suc_khoe', boostKeywords: ['giac ngu', 'suc khoe', 'nao bo'] },

  // Học ngoại ngữ
  'hoc tieng anh': { genreId: 'hoc_ngoai_ngu', boostKeywords: ['giao tiep', 'ngu phap', 'ielts', 'tu vung', 'nghe noi'] },
  'ngoai ngu': { genreId: 'hoc_ngoai_ngu', boostKeywords: ['tieng anh', 'phat am', 'tu nhien', 'phan xa'] },
  'ielts': { genreId: 'hoc_ngoai_ngu', boostKeywords: ['tu vung', 'hoc thuat', 'thi cu', 'chinh phuc'] },
  'tieng anh': { genreId: 'hoc_ngoai_ngu', boostKeywords: ['ngu phap', 'luyen noi', 'tu vung'] },

  // Văn học
  'van hoc': { genreId: 'van_hoc', boostKeywords: ['tieu thuyet', 'truyen ngan', 'cam xuc', 'nhan van'] },
  'doc truyen': { genreId: 'van_hoc', boostKeywords: ['tieu thuyet', 'hoi niem', 'tinh yeu', 'cuoc doi'] },
  'tieu thuyet': { genreId: 'van_hoc', boostKeywords: ['van hoc', 'chuyen', 'tinh cam'] },

  // Khoa học & lịch sử
  'khoa hoc': { genreId: 'khoa_hoc_lich_su', boostKeywords: ['vu tru', 'loai nguoi', 'vat ly', 'tuong lai', 'nao bo'] },
  'lich su': { genreId: 'khoa_hoc_lich_su', boostKeywords: ['sapiens', 'tien hoa', 'nhan loai', 'qua khu'] },
  'vu tru': { genreId: 'khoa_hoc_lich_su', boostKeywords: ['vat ly', 'thoi gian', 'lo den', 'khoa hoc'] },

  // Thiếu nhi
  'thieu nhi': { genreId: 'thieu_nhi', boostKeywords: ['tuoi tho', 'tre em', 'co tich', 'dong que', 'hon nhien'] },
  'tuoi tho': { genreId: 'thieu_nhi', boostKeywords: ['hon nhien', 'ky uc', 'ban be', 've tuoi tho'] },
};

/**
 * Tìm kiếm theo mục tiêu bằng ngôn ngữ tự nhiên
 */
export async function mockSearchByGoal(query: string, limit = 12): Promise<GoalSearchResponse> {
  const normalizedQuery = removeVietnameseAccents(query);
  const queryTokens = tokenizeWords(query);

  const matchedGenreIds = new Set<string>();
  const matchedKeywords: string[] = [];

  // 1. Quét đối chiếu từ khóa mục tiêu
  for (const [key, mapping] of Object.entries(GOAL_KEYWORDS_MAP)) {
    if (normalizedQuery.includes(key)) {
      matchedGenreIds.add(mapping.genreId);
      matchedKeywords.push(key);
    }
  }

  // Nếu không khớp chuỗi trực tiếp, thử quét từng token
  if (matchedGenreIds.size === 0) {
    for (const [key, mapping] of Object.entries(GOAL_KEYWORDS_MAP)) {
      const keyWords = key.split(' ');
      const hasOverlap = keyWords.some(kw => queryTokens.includes(kw));
      if (hasOverlap) {
        matchedGenreIds.add(mapping.genreId);
        matchedKeywords.push(key);
      }
    }
  }

  // 2. Chấm điểm từng cuốn sách
  const scoredItems = MOCK_BOOKS.map(book => {
    let score = 0.2; // Điểm nền
    const reasons: string[] = [];

    const normTitle = removeVietnameseAccents(book.title);
    const normDesc = removeVietnameseAccents(book.description);

    // Điểm thưởng thể loại
    const hasMatchedGenre = book.genres.some(g => matchedGenreIds.has(g));
    if (hasMatchedGenre) {
      score += 0.45;
      const primaryGenreId = book.genres.find(g => matchedGenreIds.has(g)) || book.genres[0];
      const genreName = GENRES_MAP[primaryGenreId] || 'Thể loại tương thích';
      reasons.push(`Thuộc nhóm '${genreName}'`);
    }

    // Điểm thưởng từ khóa trùng khớp trực tiếp với tiêu đề hoặc mô tả
    let wordMatchCount = 0;
    for (const token of queryTokens) {
      if (normTitle.includes(token)) {
        score += 0.15;
        wordMatchCount++;
      } else if (normDesc.includes(token)) {
        score += 0.08;
        wordMatchCount++;
      }
    }

    if (matchedKeywords.length > 0) {
      reasons.push(`Khớp từ khóa '${matchedKeywords.slice(0, 2).join(', ')}'`);
    } else if (wordMatchCount > 0) {
      reasons.push(`Có ${wordMatchCount} từ khóa liên quan đến mục tiêu của bạn`);
    }

    // Điểm đánh giá (rating) uy tín
    if (book.rating) {
      score += (book.rating / 5) * 0.1;
    }

    // Giới hạn điểm từ 0.35 đến 0.98
    const finalScore = Math.min(0.98, Math.max(0.35, parseFloat(score.toFixed(2))));

    const reasonText = reasons.length > 0
      ? reasons.join(', ')
      : 'Sách có nội dung bổ trợ hữu ích cho mục tiêu này';

    return {
      book,
      score: finalScore,
      reason: reasonText,
    };
  });

  // Lọc lấy các sách có điểm tốt hoặc liên quan đến thể loại
  const filtered = scoredItems
    .filter(item => {
      if (matchedGenreIds.size > 0) {
        return item.book.genres.some(g => matchedGenreIds.has(g)) || item.score >= 0.55;
      }
      return item.score >= 0.45;
    })
    .sort((a, b) => b.score - a.score);

  return {
    query,
    matched_genres: Array.from(matchedGenreIds),
    items: filtered.slice(0, limit),
  };
}
