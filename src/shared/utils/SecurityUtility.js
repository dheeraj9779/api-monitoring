class SecurityUtils{

    static PASSWORD_REQUIREMENTS = {
        minLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '8'),
        requireUpperCase: (process.env.PASSWORD_REQUIRE_UPPERCASE || 'true') === 'true',
        requireLowerCase: (process.env.PASSWORD_REQUIRE_LOWERCASE || 'true') === 'true',
        requireNumbers: (process.env.PASSWORD_REQUIRE_NUMBERS || 'true') === 'true',
        requireSymbols: (process.env.PASSWORD_REQUIRE_SYMBOLS || 'true') === 'true',
    };

    /**
     * 
     * @param {string} password
     * @return {Object}
     */
    static validatePassword(password){
        const errors = [];
        const requirements = this.PASSWORD_REQUIREMENTS;

        if(!password){
            return {
                success: false,
                errors: ['Password is required']
            }
        }

        if(password.length < requirements.minLength){
            errors.push(`Password must be at least ${requirements.minLength} chars long`);
        }

        if(requirements.requireUpperCase && !/[A-Z]/.test(password)){
            errors.push(`Password must contain atleast one uppercase letter`);
        }

        if(requirements.requireLowerCase && !/[a-z]/.test(password)){
            errors.push(`Password must contain atleast one lowercase letter`);
        }

        if(requirements.requireNumbers && !/[0-9]/.test(password)){
            errors.push(`Password must contain atleast one number`);
        }

        if(requirements.requireSymbols && !/[a-zA-Z0-9]/.test(password)){
            errors.push(`Password must contain atleast one special characters`);
        }

        const weakPasswords = ['password', 'password123', '123456', '12345678', 'admin123', 'admin', 'welcome']

        if(weakPasswords.includes(password.toLowerCase())){
            errors.push('Password is too common and easily guessable');
        }

        return {
            success : errors.length === 0,
            errors
        }
    }
}