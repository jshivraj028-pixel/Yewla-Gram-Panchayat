class UserModel {
  final String id;
  final String name;
  final String mobile;
  final String email;
  final String role;
  final String address;
  final int wardNumber;
  final String designation;
  final String? avatar;
  final String token;

  UserModel({
    required this.id,
    required this.name,
    required this.mobile,
    this.email = '',
    this.role = 'citizen',
    this.address = '',
    this.wardNumber = 1,
    this.designation = '',
    this.avatar = '',
    this.token = '',
  });

  factory UserModel.fromJson(Map<String, dynamic> json, {String token = ''}) {
    int parsedWard = 1;
    final w = json['wardNumber'];
    if (w is int) {
      parsedWard = w;
    } else if (w is num) {
      parsedWard = w.toInt();
    } else if (w != null) {
      parsedWard = int.tryParse(w.toString()) ?? 1;
    }

    return UserModel(
      id: json['_id']?.toString() ?? json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      mobile: json['mobile']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      role: json['role']?.toString() ?? 'citizen',
      address: json['address']?.toString() ?? '',
      wardNumber: parsedWard,
      designation: json['designation']?.toString() ?? '',
      avatar: json['avatar']?.toString() ?? '',
      token: token.isNotEmpty ? token : (json['token']?.toString() ?? ''),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'name': name,
      'mobile': mobile,
      'email': email,
      'role': role,
      'address': address,
      'wardNumber': wardNumber,
      'designation': designation,
      'avatar': avatar ?? '',
      'token': token,
    };
  }

  UserModel copyWith({
    String? id,
    String? name,
    String? mobile,
    String? email,
    String? role,
    String? address,
    int? wardNumber,
    String? designation,
    String? avatar,
    String? token,
  }) {
    return UserModel(
      id: id ?? this.id,
      name: name ?? this.name,
      mobile: mobile ?? this.mobile,
      email: email ?? this.email,
      role: role ?? this.role,
      address: address ?? this.address,
      wardNumber: wardNumber ?? this.wardNumber,
      designation: designation ?? this.designation,
      avatar: avatar ?? this.avatar,
      token: token ?? this.token,
    );
  }
}
